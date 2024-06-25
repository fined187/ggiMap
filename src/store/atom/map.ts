import { SelectedItems } from '@/models/DetailItems'
import { Form } from '@/models/Form'
import { jusoProps } from '@/models/Juso'
import { MapItem, MapListResponse } from '@/models/MapItem'
import { SelectedItem } from '@/models/SelectedItem'
import { atom } from 'recoil'
import { v4 } from 'uuid'

type Props = {
  position: [number, number]
  type: number[]
  winYn: string
}

export const mapItemsAtom = atom<MapItem[]>({
  key: `mapItems/${v4()}`,
  default: [
    {
      pnu: '',
      x: 0,
      y: 0,
      types: [1],
      ids: [''],
      winYn: '',
      usage: '',
      buildingArea: '',
      landArea: '',
      share: '',
      ratio: 0,
      amount: '',
      interest: '',
      count: 0,
      winExist: false,
    },
  ],
})

export const mapListAtom = atom<MapListResponse>({
  key: `mapList/${v4()}`,
  default: {
    contents: [
      {
        type: 1,
        id: '',
        idCode: '',
        caseNo: '',
        appraisalAmt: 0,
        minAmt: 0,
        winAmt: 0,
        ratio: 0,
        buildingArea: '',
        landArea: '',
        path: '',
        status: '',
        startDate: '',
        dividendDate: '',
        claim: 0,
        interest: '',
        x: 0,
        y: 0,
        checkInfo: '',
      },
    ],
    paging: {
      isFirst: false,
      isLast: false,
      pageNumber: 0,
      totalPages: 0,
      isEmpty: false,
      pageSize: 0,
      totalElements: 0,
    },
  },
})

export const markerPositionAtom = atom<Props>({
  key: `markerPosition/${v4()}`,
  default: {
    position: [0, 0],
    type: [1],
    winYn: '',
  },
})

export const formDataAtom = atom<Form>({
  key: `formData/${v4()}`,
  default: {
    ids: ['2', '3', '4', '5', '6', '7', '9', '10', '11', '12', '13', '14'],
    fromAppraisalAmount: 0,
    toAppraisalAmount: 0,
    fromMinimumAmount: 0,
    toMinimumAmount: 0,
    interests: false,
    x1: 1,
    y1: 1,
    x2: 1,
    y2: 1,
    awardedMonths: 0,
    km: true,
    kw: true,
    gm: true,
    gg: true,
    ekm: false,
    egm: false,
    egg: false,
    keyword: '',
    isSubFilterBoxOpen: false,
    lastFilter: 1,
    selectedType: null,
    selectedId: null,
  },
})

export const jusoAtom = atom<jusoProps>({
  key: `juso/${v4()}`,
  default: {
    topSido: '',
    topGungu: '',
    topDong: '',
    bottomSido: '',
    bottomGungu: '',
    bottomDong: '',
  },
})

export const clickedItemAtom = atom<MapItem | null>({
  key: `clicked/${v4()}`,
  default: null,
})

export const listOverItemAtom = atom({
  key: `listOver/${v4()}`,
  default: {
    x: 0,
    y: 0,
    isOver: false,
  },
})

export const selectedItemAtom = atom<SelectedItem | null>({
  key: `selectedItem/${v4()}`,
  default: null,
})

export const isOnlySelectedAtom = atom<boolean>({
  key: `isOnlySelected/${v4()}`,
  default: false,
})
