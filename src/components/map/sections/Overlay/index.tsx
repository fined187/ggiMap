/* eslint-disable react-hooks/rules-of-hooks */
import Flex from '@/components/shared/Flex'
import { css } from '@emotion/react'
import {
  Dispatch,
  MutableRefObject,
  SetStateAction,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react'
import Top from './Top'
import Bottom from './Bottom'
import { ItemDetail } from '@/models/ItemDetail'
import { MapItem } from '@/models/MapItem'
import { useRecoilState } from 'recoil'
import { mapItemOriginAtom, markerPositionAtom } from '@/store/atom/map'
import { useGetDetail } from './hooks/useGetDetail'
import useSWR from 'swr'
import { MAP_KEY } from '../hooks/useMap'

type PositionSet = {
  top: number
  left: number
  right: number
  bottom: number
}
interface OverlayProps {
  clickedItem: MapItem | null
  setClickedItem: Dispatch<SetStateAction<MapItem | null>>
  setOpenOverlay: Dispatch<SetStateAction<boolean>>
  markerClickedRef: MutableRefObject<boolean>
  openOverlay: boolean
  style: any
  setIncludeWinYn: Dispatch<SetStateAction<boolean>>
  positionSet: PositionSet
  setPositionSet: Dispatch<SetStateAction<PositionSet>>
  halfDimensions: { width: number; height: number }
  setHalfDimensions: Dispatch<SetStateAction<{ width: number; height: number }>>
}

export default function Overlay({
  clickedItem,
  setClickedItem,
  style,
  setIncludeWinYn,
  positionSet,
  setPositionSet,
  halfDimensions,
  setHalfDimensions,
}: OverlayProps) {
  const [clickedInfo, setClickedInfo] = useState<ItemDetail[] | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const [mapOrigin, setMapOrigin] = useRecoilState(mapItemOriginAtom)
  const [markerPosition, setMarkerPosition] = useRecoilState(markerPositionAtom)
  const [nowIndex, setNowIndex] = useState<number>(0)
  const { data: map } = useSWR(MAP_KEY)

  const handleGetIds = useCallback(
    (pnu: string) => {
      let ids: string[] = []
      for (const pnus of mapOrigin ?? []) {
        if (pnus.pnu === pnu) {
          ids.push(pnus.id)
        }
      }
      return ids
    },
    [mapOrigin],
  )
  const calculateScreenNum = useMemo(() => {
    let position = {
      first: false,
      second: false,
      third: false,
      fourth: false,
    }

    if (
      markerPosition.position[0] > 390 &&
      markerPosition.position[0] < halfDimensions.width &&
      markerPosition.position[1] < halfDimensions.height
    ) {
      position.first = true
    } else if (
      markerPosition.position[1] < halfDimensions.height &&
      markerPosition.position[0] > halfDimensions.width
    ) {
      position.second = true
    } else if (
      markerPosition.position[1] > halfDimensions.height &&
      markerPosition.position[0] > halfDimensions.width
    ) {
      position.third = true
    } else if (
      markerPosition.position[1] > halfDimensions.height &&
      markerPosition.position[0] > 370 &&
      markerPosition.position[0] < halfDimensions.width
    ) {
      position.fourth = true
    } else {
      position.first = false
      position.second = false
      position.third = false
      position.fourth = false
    }

    return position
  }, [markerPosition, halfDimensions])

  const handleGetType = useCallback(
    (pnu: string) => {
      let type: number[] = []
      for (const pnus of mapOrigin ?? []) {
        if (pnus.pnu === pnu) {
          type.push(pnus.type)
        }
      }
      return type
    },
    [mapOrigin],
  )

  const handleCalcLeftTop = useCallback(() => {
    if (map.getZoom() > 15) {
      if (
        markerPosition.type === 1 ||
        markerPosition.type === 2 ||
        markerPosition.type === 3
      ) {
        if (markerPosition.winYn === 'Y') {
          if (map.getZoom() === 16) {
            console.log('여기')
            if (calculateScreenNum.first) {
              return {
                left: markerPosition.position[0] + 100,
                top: markerPosition.position[1] + 30,
              }
            } else if (calculateScreenNum.second) {
              return {
                left: markerPosition.position[0] - 300,
                top: markerPosition.position[1] + 30,
              }
            } else if (calculateScreenNum.third) {
              return {
                left: markerPosition.position[0] - 300,
                top: markerPosition.position[1] - 320,
              }
            } else if (calculateScreenNum.fourth) {
              return {
                left: markerPosition.position[0] + 100,
                top: markerPosition.position[1] - 320,
              }
            } else {
              return {
                left: 0,
                top: 0,
              }
            }
          } else if (map.getZoom() > 16) {
            if (calculateScreenNum.first) {
              return {
                left: markerPosition.position[0] + 100,
                top: markerPosition.position[1] + 90,
              }
            } else if (calculateScreenNum.second) {
              return {
                left: markerPosition.position[0] - 300,
                top: markerPosition.position[1] + 100,
              }
            } else if (calculateScreenNum.third) {
              return {
                left: markerPosition.position[0] - 300,
                top: markerPosition.position[1] - 320,
              }
            } else if (calculateScreenNum.fourth) {
              return {
                left: markerPosition.position[0] + 100,
                top: markerPosition.position[1] - 320,
              }
            } else {
              return {
                left: 0,
                top: 0,
              }
            }
          }
        } else if (calculateScreenNum.first) {
          return {
            left: markerPosition.position[0] + 100,
            top: markerPosition.position[1] + 90,
          }
        } else if (calculateScreenNum.second) {
          return {
            left: markerPosition.position[0] - 300,
            top: markerPosition.position[1] + 100,
          }
        } else if (calculateScreenNum.third) {
          return {
            left: markerPosition.position[0] - 300,
            top: markerPosition.position[1] - 320,
          }
        } else if (calculateScreenNum.fourth) {
          return {
            left: markerPosition.position[0] + 100,
            top: markerPosition.position[1] - 320,
          }
        } else {
          return {
            left: 0,
            top: 0,
          }
        }
      } else if (markerPosition.type === 4) {
        if (calculateScreenNum.first) {
          return {
            left: markerPosition.position[0] + 100,
            top: markerPosition.position[1] + 30,
          }
        } else if (calculateScreenNum.second) {
          return {
            left: markerPosition.position[0] - 300,
            top: markerPosition.position[1] + 40,
          }
        } else if (calculateScreenNum.third) {
          return {
            left: markerPosition.position[0] - 300,
            top: markerPosition.position[1] - 320,
          }
        } else if (calculateScreenNum.fourth) {
          return {
            left: markerPosition.position[0] + 100,
            top: markerPosition.position[1] - 320,
          }
        } else {
          return {
            left: 0,
            top: 0,
          }
        }
      }
    } else {
      if (
        markerPosition.type === 1 ||
        markerPosition.type === 2 ||
        markerPosition.type === 3
      ) {
        if (markerPosition.winYn === 'Y') {
          if (map.getZoom() === 15) {
            if (calculateScreenNum.first) {
              return {
                left: markerPosition.position[0] + 10,
                top: markerPosition.position[1] + 10,
              }
            } else if (calculateScreenNum.second) {
              return {
                left: markerPosition.position[0] - 300,
                top: markerPosition.position[1] + 10,
              }
            } else if (calculateScreenNum.third) {
              return {
                left: markerPosition.position[0] - 300,
                top: markerPosition.position[1] - 320,
              }
            } else if (calculateScreenNum.fourth) {
              return {
                left: markerPosition.position[0] + 10,
                top: markerPosition.position[1] - 330,
              }
            }
          } else if (map.getZoom() < 15) {
            if (calculateScreenNum.first) {
              return {
                left: markerPosition.position[0] + 100,
                top: markerPosition.position[1] + 50,
              }
            } else if (calculateScreenNum.second) {
              return {
                left: markerPosition.position[0] - 300,
                top: markerPosition.position[1] + 40,
              }
            } else if (calculateScreenNum.third) {
              return {
                left: markerPosition.position[0] - 300,
                top: markerPosition.position[1] - 320,
              }
            } else if (calculateScreenNum.fourth) {
              return {
                left: markerPosition.position[0] + 100,
                top: markerPosition.position[1] - 320,
              }
            }
          }
        } else {
          if (calculateScreenNum.first) {
            return {
              left: markerPosition.position[0] + 100,
              top: markerPosition.position[1] + 30,
            }
          } else if (calculateScreenNum.second) {
            return {
              left: markerPosition.position[0] - 300,
              top: markerPosition.position[1] + 40,
            }
          } else if (calculateScreenNum.third) {
            return {
              left: markerPosition.position[0] - 300,
              top: markerPosition.position[1] - 320,
            }
          } else if (calculateScreenNum.fourth) {
            return {
              left: markerPosition.position[0] + 100,
              top: markerPosition.position[1] - 320,
            }
          }
        }
      } else if (markerPosition.type === 4) {
        if (calculateScreenNum.first) {
          return {
            left: markerPosition.position[0] + 10,
            top: markerPosition.position[1] + 10,
          }
        } else if (calculateScreenNum.second) {
          return {
            left: markerPosition.position[0] - 300,
            top: markerPosition.position[1] + 10,
          }
        } else if (calculateScreenNum.third) {
          return {
            left: markerPosition.position[0] - 300,
            top: markerPosition.position[1] - 320,
          }
        } else if (calculateScreenNum.fourth) {
          return {
            left: markerPosition.position[0] + 10,
            top: markerPosition.position[1] - 330,
          }
        }
      }
      return {
        left: 0,
        top: 0,
      }
    }
  }, [markerPosition, calculateScreenNum])

  useGetDetail(
    handleGetIds(clickedItem?.pnu as string),
    handleGetType(clickedItem?.pnu as string),
    setClickedInfo,
    clickedItem,
  )
  return (
    <Flex
      css={Overlaytop}
      ref={ref}
      style={{
        left:
          handleCalcLeftTop()?.left !== 0
            ? handleCalcLeftTop()?.left + 'px'
            : '50%',
        top:
          handleCalcLeftTop()?.top !== 0
            ? handleCalcLeftTop()?.top + 'px'
            : '50%',
        transform:
          handleCalcLeftTop()?.top === 0 && handleCalcLeftTop()?.left === 0
            ? 'translate(-50%, -50%)'
            : '',
      }}
    >
      <Top
        clickedInfo={clickedInfo}
        setClickedInfo={setClickedInfo}
        clickedItem={clickedItem}
        setClickedItem={setClickedItem}
        nowIndex={nowIndex}
        setNowIndex={setNowIndex}
      />
      <Bottom
        clickedInfo={clickedInfo}
        clickedItem={clickedItem}
        nowIndex={nowIndex}
      />
    </Flex>
  )
}

const Overlaytop = css`
  width: 300px;
  height: 326px;
  border-radius: 8px 8px 8px 8px;
  border: 0.5px solid #9d9999;
  z-index: 10;
  position: absolute;
  background: white;
  flex-direction: column;
`
