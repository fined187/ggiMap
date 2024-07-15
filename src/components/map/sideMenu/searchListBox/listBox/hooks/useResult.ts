import { MAP_KEY } from '@/components/map/sections/hooks/useMap'
import { useReverseGeoCode } from '@/components/map/sections/hooks/useReverseGeoCode'
import { authInfo } from '@/store/atom/auth'
import {
  formDataAtom,
  isOnlySelectedAtom,
  jusoAtom,
  mapListAtom,
  pageAtom,
  selectedItemAtom,
} from '@/store/atom/map'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  SetterOrUpdater,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
} from 'recoil'
import useSWR from 'swr'
import useSearchListQuery from './useSearchListQuery'
import { Form } from '@/models/Form'
import { Auth } from '@/models/Auth'
import { MapListResponse } from '@/models/MapItem'
import { InfiniteData } from 'react-query'

const useResult = (
  setIsOpen: Dispatch<SetStateAction<boolean>>,
  dragStateRef: MutableRefObject<boolean>,
) => {
  const { data: map } = useSWR(MAP_KEY)
  const [formData, setFormData] = useRecoilState(formDataAtom)
  const [mapListItems, setMapListItems] = useRecoilState(mapListAtom)
  const [showingList, setShowingList] = useState(false)
  const scrollbarRef = useRef<HTMLDivElement | null>(null)
  const setJuso = useSetRecoilState(jusoAtom)
  const auth = useRecoilValue(authInfo)
  const [selectedItem, setSelectedItem] = useRecoilState(selectedItemAtom)
  const [isOnlySelected, setIsOnlySelected] = useRecoilState(isOnlySelectedAtom)
  const setPage = useSetRecoilState(pageAtom)
  const { performReverseGeocode } = useReverseGeoCode()
  const [mapData, setMapData] = useState(getInitialMapData(formData, auth))

  const handleCenterChanged = useCallback(() => {
    if (!map) return
    const mapCenter: naver.maps.Point = map.getCenter()
    const centerCoords = { lat: mapCenter.y, lng: mapCenter.x }
    performReverseGeocode(centerCoords)
  }, [map, setJuso, performReverseGeocode])

  const { data, fetchNextPage, hasNextPage, isLoading } = useSearchListQuery({
    mapData,
    handleCenterChanged,
    dragStateRef,
  })

  const scrollToTop = useCallback(() => {
    if (!scrollbarRef.current) return
    scrollbarRef.current?.scrollTo(0, 0)
  }, [scrollbarRef.current])

  useEffect(() => {
    if (map && map.getZoom()! >= 15) {
      setShowingList(true)
      setPage(1)
    } else if (map && map.getZoom()! < 15) {
      setShowingList(false)
      setIsOpen(true)
    }
  }, [map, map?.getZoom(), setPage, setIsOpen])
  useEffect(() => {
    setMapData(getMapData(formData, auth))
  }, [formData, auth])

  useEffect(() => {
    handleUpdateMapList(data, setMapListItems, scrollToTop)
  }, [data, setMapListItems])

  const handleReturnSelectedItems = useCallback(() => {
    if (auth.type === '1') {
      return selectedItem?.kmItem
    } else if (auth.type === '2' || auth.type === '3') {
      return selectedItem?.gmItem
    } else if (auth.type === '4') {
      return selectedItem?.kwItem
    }
  }, [auth.type, selectedItem])

  const handleReturnPageInfo = useCallback(() => {
    let pageInfo = 0
    if (auth.idCode !== '') {
      if (isOnlySelected) {
        pageInfo = 1
        return pageInfo
      } else {
        pageInfo = mapListItems?.paging?.totalElements + 1
        return pageInfo
      }
    } else {
      pageInfo = mapListItems?.paging?.totalElements
      return pageInfo
    }
  }, [auth.idCode, isOnlySelected, mapListItems])

  return {
    isShowingList: showingList,
    mapListItems,
    scrollbarRef,
    handleReturnSelectedItems,
    handleReturnPageInfo,
    isLoading,
    fetchNextPage,
    hasNextPage,
    setIsOpen,
    scrollToTop,
    isOnlySelected,
    auth,
  }
}

const getInitialMapData = (formData: Form, auth: Auth) => ({
  ids:
    formData.ids.length === 12 ? '0' : formData.ids.map((id) => id).join(','),
  fromAppraisalAmount: formData.fromAppraisalAmount,
  toAppraisalAmount: formData.toAppraisalAmount,
  fromMinimumAmount: formData.fromMinimumAmount,
  toMinimumAmount: formData.toMinimumAmount,
  interests: formData.interests,
  x1: formData.x1,
  y1: formData.y1,
  x2: formData.x2,
  y2: formData.y2,
  awardedMonths: formData.awardedMonths,
  km: formData.km,
  kw: formData.kw,
  gm: formData.gm,
  gg: formData.gg,
  ekm: formData.ekm,
  egm: formData.egm,
  egg: formData.egg,
  role: formData.role,
  selectedId: auth.idCode !== '' ? auth.idCode : null,
  selectedType: auth.type !== '' ? parseInt(auth.type) : null,
})

const getMapData = (formData: Form, auth: Auth) => ({
  ids:
    formData.ids.length === 12 || formData.ids.length === 0
      ? '0'
      : formData.ids.map((id) => id).join(','),
  fromAppraisalAmount: formData.fromAppraisalAmount,
  toAppraisalAmount: formData.toAppraisalAmount,
  fromMinimumAmount: formData.fromMinimumAmount,
  toMinimumAmount: formData.toMinimumAmount,
  interests: formData.interests,
  x1: formData.x1,
  y1: formData.y1,
  x2: formData.x2,
  y2: formData.y2,
  awardedMonths: formData.awardedMonths,
  km: formData.km,
  kw: formData.kw,
  gm: formData.gm,
  gg: formData.gg,
  ekm: formData.ekm,
  egm: formData.egm,
  egg: formData.egg,
  role: formData.role,
  selectedId: auth.idCode !== '' ? auth.idCode : null,
  selectedType: auth.type !== '' ? parseInt(auth.type) : null,
})

const handleUpdateMapList = (
  data: InfiniteData<MapListResponse | undefined> | undefined,
  setMapListItems: SetterOrUpdater<MapListResponse>,
  scrollToTop: () => void,
) => {
  if (data?.pageParams[0] === undefined && data?.pages[0] === undefined) return
  if (data.pageParams.length === 1) {
    scrollToTop()
    setMapListItems((prev: any) => ({
      ...prev,
      contents: data.pages[0]?.contents,
      paging: data.pages[0]?.paging,
    }))
  } else if (data.pageParams.length > 1) {
    setMapListItems((prev) => ({
      ...prev,
      contents: [
        ...(prev?.contents ?? []),
        ...((data && data?.pages[data.pages.length - 1]?.contents) ?? []),
      ],
    }))
  }
}

export default useResult
