import { MapItem } from '@/models/MapItem'
import { NumToHan } from '@/utils/NumToHan'

export const PnuCountIcon = (
  item: MapItem,
  count: number,
  type: number,
  top?: string,
) => {
  return `
  <div style="position: absolute; right: 0px; top: ${
    top ? `${top}px` : '-40px'
  };">
    <div style="display: inline-flex; padding: 0px 5px 1px 5px; justify-content: center; align-items: center; border-radius: 100px; border: ${
      item.winYn === 'Y'
        ? '1px solid #FF4D00'
        : type === 1
        ? '1px solid #0038FF'
        : type === 3
        ? '1px solid #8F00FF'
        : type === 2
        ? '1px solid #0087B1'
        : '1px solid #1C8D00'
    }; background: #FFF;">
      <span style="color: #000001; text-align: center; font-family: SUIT; font-size: 10px; font-style: normal; font-weight: 700; line-height: 135%; letter-spacing: -0.1px;">
        ${count > 99 ? '99+' : count}
      </span>
    </div>
  </div>
  `
}

export const UsageIcon = (
  item: MapItem,
  handleItemUsage: () => string,
  type: number,
) => {
  return `
  <div style="display: inline-flex; padding: 10px 6px; width: 45px; height: 32px; justify-content: center; align-items: center;border-radius: 17.5px 0px 0px 0px; border-left: ${
    item.winYn === 'Y'
      ? '1px solid #FF4D00'
      : type === 1
      ? '1px solid #0038FF'
      : type === 3
      ? '1px solid #8F00FF'
      : type === 2
      ? '1px solid #0087B1'
      : '1px solid #1C8D00'
  }; border-top: ${
    item.winYn === 'Y'
      ? '1px solid #FF4D00'
      : type === 1
      ? '1px solid #0038FF'
      : type === 3
      ? '1px solid #8F00FF'
      : type === 2
      ? '1px solid #0087B1'
      : '1px solid #1C8D00'
  }; border-bottom: ${
    item.winYn === 'Y'
      ? '1px solid #FF4D00'
      : type === 1
      ? '1px solid #0038FF'
      : type === 3
      ? '1px solid #8F00FF'
      : type === 2
      ? '1px solid #0087B1'
      : '1px solid #1C8D00'
  }; background: #FFF;">
    <span style="color: ${
      item.winYn === 'Y'
        ? '#FF4D00'
        : type === 1
        ? '#0038FF'
        : type === 3
        ? '#8F00FF'
        : type === 2
        ? '#0087B1'
        : '#1C8D00'
    }; text-align: center; font-family: SUIT; font-size: 11px; font-style: normal; font-weight: 800; line-height: 110%; letter-spacing: -0.22px;">
      ${item.winYn === 'Y' ? '낙찰' : handleItemUsage()}
    </span>
  </div>
  `
}

export const AmountIcon = (item: MapItem, type: number) => {
  return `
  <div style="display: flex; width: 56px; height: 32px; padding: 2px 4px 2px 2px; justify-content: center; align-items: center; gap: 10px; flex-shrink: 0; border-radius: 0px 100px 100px 0px; background: ${
    type === 1
      ? '#0038FF'
      : type === 3
      ? '#8F00FF'
      : type === 2
      ? '#0087B1'
      : '#1C8D00'
  }; border-right: ${
    item.winYn === 'Y'
      ? '1px solid #FF4D00'
      : type === 1
      ? '1px solid #0038FF'
      : type === 3
      ? '1px solid #8F00FF'
      : type === 2
      ? '1px solid #0087B1'
      : '1px solid #1C8D00'
  }; border-top:${
    item.winYn === 'Y'
      ? '1px solid #FF4D00'
      : type === 1
      ? '1px solid #0038FF'
      : type === 3
      ? '1px solid #8F00FF'
      : type === 2
      ? '1px solid #0087B1'
      : '1px solid #1C8D00'
  }; border-bottom: ${
    item.winYn === 'Y'
      ? '1px solid #FF4D00'
      : type === 1
      ? '1px solid #0038FF'
      : type === 3
      ? '1px solid #8F00FF'
      : type === 2
      ? '1px solid #0087B1'
      : '1px solid #1C8D00'
  };">
    <span style="color: #FFF; text-align: right; font-family: SUIT; font-size: 12px; font-style: normal; font-weight: 800; line-height: 110%; letter-spacing: -0.24px;">
      ${type === 4 ? '예정물건' : NumToHan(parseInt(item.amount))}
    </span>
  </div>
  `
}

export const ShareIcon = (item: MapItem, type: number, top?: string) => {
  return `
  <div style="position: absolute; right: 0px; top: ${
    top ? `${top}px` : '-45px'
  };">
    <div style="display: inline-flex; padding: 0px 6px 1px 6px; justify-content: center; align-items: center; border-radius: 100px; border: ${
      item.winYn === 'Y'
        ? '1px solid #FF4D00'
        : type === 1
        ? '1px solid #0038FF'
        : type === 3
        ? '1px solid #8F00FF'
        : type === 2
        ? '1px solid #0087B1'
        : '1px solid #1C8D00'
    }; background: #FFF;">
      <span style="color: #000001; text-align: center; font-family: SUIT; font-size: 10px; font-style: normal; font-weight: 700; line-height: 135%; letter-spacing: -0.1px;">
        지분
      </span>
    </div>
  </div>
  `
}

export const InterestIcon = (item: MapItem, type: number) => {
  return `
  <div style="flex-direction: row; display: flex;">
    <div style="position: absolute; right: ${
      item.share === 'Y' ? '20px' : '0px'
    };
    top: -38px;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="17" height="15" viewBox="0 0 17 15" fill="none">
        <rect x="0.5" y="0.5" width="16" height="14" rx="7" fill="white"/>
        <rect x="0.5" y="0.5" width="16" height="14" rx="7" stroke=${
          item.winYn === 'Y'
            ? '#FF4D00'
            : type === 1
            ? '#0038FF'
            : type === 3
            ? '#8F00FF'
            : type === 2
            ? '#0087B1'
            : '#1C8D00'
        } />
        <path d="M8.50283 11.5108L4.6835 8.05124C2.60777 5.97552 5.65909 1.99013 8.50283 5.21442C11.3466 1.99013 14.3841 5.98936 12.3222 8.05124L8.50283 11.5108Z" fill=${
          type === 1
            ? '#0038FF'
            : type === 3
            ? '#8F00FF'
            : type === 2
            ? '#0087B1'
            : '#1C8D00'
        } stroke=${
          type === 1
            ? '#0038FF'
            : type === 3
            ? '#8F00FF'
            : type === 2
            ? '#0087B1'
            : '#1C8D00'
        } stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
    ${item.share === 'Y' ? ShareIcon : ''}
  </div>
  `
}
