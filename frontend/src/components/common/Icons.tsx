// components/common/Icons.tsx
import React from 'react';
import styles from './Icons.module.css';

export interface IconProps {
  size?: number;
  defaultColor?: string;
  hoverColor?: string;
  className?: string;
}

const getStyleVars = (defaultColor: string, hoverColor: string) =>
  ({
    '--icon-default-color': defaultColor,
    '--icon-hover-color': hoverColor,
  }) as React.CSSProperties;

export const Drops = ({
  size = 24,
  defaultColor = '#000000',
  hoverColor = '#666666',
  className = '',
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`${styles.iconSvg} ${className}`}
    style={getStyleVars(defaultColor, hoverColor)}
  >
    <path
      d="M18.07 12.14c0-5-6.04-12.15-6.04-12.15S5.99 7.16 5.99 12.14c0 3.34 2.71 6.05 6.05 6.05s6.03-2.71 6.03-6.05z"
      className={styles.iconFill}
    />
    <path
      d="M2 17.77c-1.14 1.14-1.14 2.98 0 4.11 1.7 1.7 6.18 2.08 6.18 2.08s-.37-4.48-2.07-6.18c-1.14-1.14-2.97-1.14-4.11 0z"
      className={styles.iconFill}
    />
    <path
      d="M3.2 11.23c-.73-.73-1.92-.73-2.65 0-.73.73-.73 1.92 0 2.65 1.1 1.1 3.99 1.34 3.99 1.34s-.24-2.89-1.34-3.99z"
      className={styles.iconFill}
    />
    <path
      d="M17.79 17.77c-1.7 1.7-2.07 6.18-2.07 6.18s4.48-.37 6.18-2.07c1.14-1.14 1.14-2.98 0-4.11-1.14-1.14-2.97-1.14-4.11 0z"
      className={styles.iconFill}
    />
    <path
      d="M23.45 11.23c-.73-.73-1.92-.73-2.65 0-1.1 1.1-1.34 3.99-1.34 3.99s2.89-.24 3.99-1.34c.73-.73.73-1.92 0-2.65z"
      className={styles.iconFill}
    />
  </svg>
);

// Similarly, DashboardGauge and OilBarrel components follow the same pattern.

export const DashboardGauge = ({
  size = 24,
  defaultColor = '#000000',
  hoverColor = '#666666',
  className = '',
}: IconProps) => (
  // Your SVG markup here, just replace the className with styles.iconFill
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={`${styles.iconSvg} ${className}`}
    style={getStyleVars(defaultColor, hoverColor)}
  >
    <path
      className={styles.iconFill}
      d="M2.15 17.85v-11.46c0-.83 0.67-1.51 1.51-1.51h16.68c.83 0 1.51.68 1.51 1.51v11.46c0 .83-.68 1.51-1.51 1.51H3.66c-.84 0-1.51-.68-1.51-1.51zm19.02 0v-1.21H3.1v1.21c0 .31.25.56.56.56h16.68c.31 0 .56-.25.56-.56zM3.93 15.68V8.2c0-.15.12-.27.27-.27h16.26c.15 0 .27.12.27.27v7.48h.82V6.38c0-.31-.25-.56-.56-.56H3.66c-.31 0-.56.25-.56.56v9.3h.83zm16.19-.05V8.64H4.46v6.99h15.66z"
    />
    <path
      className={styles.iconFill}
      d="M3.9 6.79a.92.92 0 1 1 0-1.84.92.92 0 1 1 0 1.84zm1.29 0a.92.92 0 1 1 0-1.84.92.92 0 1 1 0 1.84zm1.29 0a.92.92 0 1 1 0-1.84.92.92 0 1 1 0 1.84z"
    />
    <path
      className={styles.iconFill}
      d="M12.12 14.95v-1.79c0-.15.12-.27.27-.27s.27.12.27.27v1.79c0 .15-.12.27-.27.27s-.27-.12-.27-.27z"
    />
    <path
      className={styles.iconFill}
      d="M12.39 14.24a1.03 1.03 0 1 0 0 2.06 1.03 1.03 0 0 0 0-2.06z"
    />
    <path
      className={styles.iconFill}
      d="M14.95 15.22l-.03-.53 1.11-.06.03.53-1.11.06zm-5.41 0l-1.11-.05.03-.53 1.11.05-.03.53zm4.63-1.33l-.28-.45 0.95-.58.28.45-.95.58zm-4.44 0l-.95-.58.28-.45.95.58-.28.45zm3.77-1.05l-.45-.28.58-.95.45.28-.58.95zm-2.97 0l-.58-.95.45-.28.58.95-.45.28zm-.03-1l-.06-1.11.53-.03.06 1.11-.53.03z"
    />
    <path
      className={styles.iconFill}
      d="M12.39 9.17a6.28 6.28 0 0 1 6.28 6.28h-1.06a5.22 5.22 0 0 0-5.22-5.22 5.22 5.22 0 0 0-5.22 5.22H5.98a6.28 6.28 0 0 1 6.41-6.28zm0 1.06a5.22 5.22 0 0 1 5.22 5.22h-1.06a4.16 4.16 0 0 0-4.16-4.16 4.16 4.16 0 0 0-4.16 4.16H6.77a5.22 5.22 0 0 1 5.62-5.22z"
    />
    <path
      className={styles.iconFill}
      d="M5.17 15.21h.58v-.58h-.58v.58zm13.65 0h.58v-.58h-.58v.58zm-13.65-0.85h.58v-.58h-.58v.58zm13.65 0h.58v-.58h-.58v.58zm-13.65-0.85h.58v-.58h-.58v.58zm13.65 0h.58v-.58h-.58v.58zm-13.65-0.85h.58v-.58h-.58v.58zm13.65 0h.58v-.58h-.58v.58zm-13.65-0.85h.58v-.58h-.58v.58zm0.99 0h.58v-.58h-.58v.58zm10.88 0h.58v-.58h-.58v.58zm1.79 0h.58v-.58h-.58v.58zm-13.65-0.85h.58v-.58h-.58v.58zm0.99 0h.58v-.58h-.58v.58zm0.99 0h.58v-.58h-.58v.58zm9.9 0h.58v-.58h-.58v.58zm0.99 0h.58v-.58h-.58v.58zm1.79 0h.58v-.58h-.58v.58zm-13.65-0.85h.58v-.58h-.58v.58zm0.99 0h.58v-.58h-.58v.58zm0.99 0h.58v-.58h-.58v.58zm0.99 0h.58v-.58h-.58v.58zm7.89 0h.58v-.58h-.58v.58zm0.99 0h.58v-.58h-.58v.58zm0.99 0h.58v-.58h-.58v.58zm1.79 0h.58v-.58h-.58v.58z"
    />
  </svg>
);

export const OilBarrel = ({
  size = 24,
  defaultColor = '#000000',
  hoverColor = '#666666',
  className = '',
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    className={`${styles.iconSvg} ${className}`}
    style={getStyleVars(defaultColor, hoverColor)}
  >
    <path
      className={styles.iconFill}
      d="M434.821,35.321c-7.36,0-47.875,0-52.564,0V19.692C382.257,8.817,373.44,0,362.565,0s-19.692,8.817-19.692,19.692v15.629 c-11.109,0-256.639,0-265.694,0c-10.875,0-19.692,8.817-19.692,19.692c0,10.277,7.874,18.704,17.916,19.603v417.691 c0,10.875,8.817,19.692,19.692,19.692h321.809c10.875,0,19.692-8.817,19.692-19.692V74.615 c10.043-0.898,17.917-9.326,17.917-19.602C454.514,44.138,445.697,35.321,434.821,35.321z M397.213,472.615H114.788V200.478 h282.424V472.615z M397.213,161.094H114.788V74.706h282.424V161.094z"
    />
    <path
      className={styles.iconFill}
      d="M297.303,293.548c-13.162-18.141-26.174-32.519-26.72-33.121c-3.732-4.113-9.028-6.459-14.583-6.459 s-10.85,2.346-14.583,6.459c-0.547,0.603-13.557,14.981-26.722,33.121c-12.501,17.227-29.121,42.608-29.121,64.033 c0,38.833,31.592,70.426,70.425,70.426s70.425-31.593,70.425-70.426C326.424,336.156,309.804,310.775,297.303,293.548z M256.001,388.622 c-17.115,0-31.04-13.925-31.04-31.042c0-9.303,14.479-32.396,31.047-53.399 c16.564,20.983,31.034,44.065,31.034,53.399C287.041,374.697,273.116,388.622,256.001,388.622z"
    />
  </svg>
);

export const Rel = ({
  size = 24,
  defaultColor = '#000000',
  hoverColor = '#666666',
  className = '',
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    className={`${styles.iconSvg} ${className}`}
    style={getStyleVars(defaultColor, hoverColor)}
  >
    <path
      className={styles.iconFill}
      d="M448.8,81.3L371.6,4.1c-2.6-2.6-6.2-4.1-10-4.1H69.2c-7.8,0-14.1,6.3-14.1,14.1v479.8c0,7.8,6.3,14.1,14.1,14.1h369.6
			c7.8,0,14.1-6.3,14.1-14.1V91.3C452.9,87.5,451.4,83.9,448.8,81.3z M375.7,48.2l29,29h-29V48.2z M83.3,479.8V28.2h264.2v63
			c0,7.8,6.3,14.1,14.1,14.1h63v374.5H83.3z"
    />

    <path
      className={styles.iconFill}
      d="M385.5,138.1H234.6c-7.8,0-14.1,6.3-14.1,14.1c0,7.8,6.3,14.1,14.1,14.1h150.9c7.8,0,14.1-6.3,14.1-14.1
			C399.6,144.4,393.3,138.1,385.5,138.1z"
    />

    <path
      className={styles.iconFill}
      d="M385.5,271.3H234.6c-7.8,0-14.1,6.3-14.1,14.1c0,7.8,6.3,14.1,14.1,14.1h150.9c7.8,0,14.1-6.3,14.1-14.1
			C399.6,277.6,393.3,271.3,385.5,271.3z"
    />

    <path
      className={styles.iconFill}
      d="M385.5,404.6H234.6c-7.8,0-14.1,6.3-14.1,14.1c0,7.8,6.3,14.1,14.1,14.1h150.9c7.8,0,14.1-6.3,14.1-14.1
			C399.6,410.9,393.3,404.6,385.5,404.6z"
    />

    <path
      className={styles.iconFill}
      d="M189.1,104.8h-66.6c-7.8,0-14.1,6.3-14.1,14.1v66.6c0,7.8,6.3,14.1,14.1,14.1h66.6c7.8,0,14.1-6.3,14.1-14.1v-66.6
			C203.2,111.1,196.9,104.8,189.1,104.8z M175,171.4h-38.4V133H175V171.4z"
    />

    <path
      className={styles.iconFill}
      d="M189.1,238.1h-66.6c-7.8,0-14.1,6.3-14.1,14.1v66.6c0,7.8,6.3,14.1,14.1,14.1h66.6c7.8,0,14.1-6.3,14.1-14.1v-66.6
			C203.2,244.4,196.9,238.1,189.1,238.1z M175,304.7h-38.4v-38.4H175V304.7z"
    />

    <path
      className={styles.iconFill}
      d="M213.3,377.7c-5.6-5.5-14.5-5.5-20,0l-42.9,42.9l-17.8-17.8c-5.5-5.5-14.4-5.5-20,0c-5.5,5.5-5.5,14.4,0,20l27.8,27.8
			c2.8,2.8,6.4,4.1,10,4.1c3.6,0,7.2-1.4,10-4.1l52.9-52.9C218.8,392.2,218.8,383.3,213.3,377.7z"
    />
  </svg>
);

export const Trend1 = ({
  size = 24,
  defaultColor = '#000000',
  hoverColor = '#666666',
  className = '',
}: IconProps) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 512 512"
    fill="none"
    className={`${styles.iconSvg} ${className}`}
    style={getStyleVars(defaultColor, hoverColor)}
  >
    <path
      fill="#000000"
      d="M318 123.645l-61.5 35.7-61.76-35.7 61.76-35.7zm93.68 54.19l-61.76 35.7 61.76 35.7 61.5-35.7zm-294.39 80.64l61.76 35.7 61.5-35.7-61.5-35.7zm139.52-80.57l-61.76 35.7 61.76 35.7 61.5-35.7zM31 298.365l62 35.69v-71l-62-35.65v71zm373-26l-62 35.69v70.94l62-35.66v-70.97zm-225.11-139.4l-61.76 35.7 61.76 35.7 61.5-35.7zM109 343.305l62 35.69v-70.94l-62-35.69v71zm225.41-120.45l-61.76 35.7 61.76 35.7 61.5-35.7zM249 353.055l-62-35.7v71l62 35.7v-71zm77-35.67l-61 35.67v70.94l61-35.66v-70.95zm8.07-184.5l-61.76 35.7 61.76 35.7 61.5-35.7zm-232.6 44.95l-61.77 35.7 61.76 35.7 61.5-35.7zM481 227.565l-61 35.66v70.94l61-35.66v-70.94zm-286.11 75.93l61.76 35.7 61.5-35.7-61.5-35.7z"
      className={styles.iconFill}
    />
  </svg>
);
