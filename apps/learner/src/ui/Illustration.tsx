import { Image } from 'react-native';
import type { Vocabulary } from '@smartlingo/domain';

const drawings: Record<Vocabulary['picture'], string> = {
  cup: '<ellipse cx="150" cy="178" rx="87" ry="15" fill="#D6D8B7"/><path d="M193 102h17q35 0 25 28q-7 17-36 14" fill="none"/><path d="M87 97h113l-9 55q-8 30-47 30t-49-30z" fill="#FFFDF7"/><ellipse cx="144" cy="98" rx="56" ry="12" fill="#8D5F3D"/><path d="M118 68q-14-14 0-28m28 28q-14-14 0-28m28 28q-14-14 0-28" fill="none"/>',
  water: '<path d="M75 64h67l-7 116H84z" fill="#D5E8E9"/><path d="M81 108h55l-5 67H87z" fill="#8ABBCB" stroke="none"/><path d="M185 71h39l13 29v80h-67v-80z" fill="#D5E8E9"/><path d="M177 121h53v51h-53z" fill="#8ABBCB" stroke="none"/><path d="M237 105q40 0 22 46h-22" fill="none"/>',
  menu: '<path d="M64 58q43-15 86 10q43-25 86-10v129q-43-15-86 10q-43-25-86-10z" fill="#FFFDF7"/><path d="M150 68v129M83 135h45m-45 17h45m44-54h44m-44 20h44m-44 20h44m-44 20h29" fill="none"/><circle cx="107" cy="102" r="17" fill="#F9D936"/>',
  bill: '<path d="M95 37l12 8l12-8l12 8l12-8l12 8l12-8l12 8l12-8l12 8v154l-13-8l-13 8l-13-8l-13 8l-13-8l-13 8l-13-8l-12 8z" fill="#FFFDF7"/><path d="M116 77h64m-64 25h36m15 0h13m-64 23h36m15 0h13m-64 23h64" fill="none"/><circle cx="183" cy="176" r="26" fill="#F9D936"/><path d="M172 176h22m-22 7h17" fill="none"/>',
  greeting: '<path d="M76 198q-4-60 50-60h28q48 0 48 60" fill="#82B78D"/><circle cx="140" cy="91" r="38" fill="#EDBC8B"/><path d="M103 82q0-45 43-34q34 7 31 37q-36-1-53-20z" fill="#443E2E"/><path d="M194 157l27-51l-5-37q0-14 10-11l9 30l7-28q8-9 12 2l-3 46l-27 67" fill="#EDBC8B"/><path d="M251 42l8-9m-41 5l-5-11m56 41l12-2" fill="none"/><circle cx="128" cy="92" r="2"/><circle cx="153" cy="92" r="2"/><path d="M131 109q10 8 19-1" fill="none"/>',
  please: '<path d="M83 183l38-45l17-75q6-18 13 0v61l-11 47l-27 30z" fill="#EDBC8B"/><path d="M218 183l-38-45l-17-75q-6-18-13 0v61l11 47l27 30z" fill="#EDBC8B"/><path d="M60 166l36 35l-19 21l-36-35m199-21l-36 35l19 21l36-35" fill="#82B78D"/><path d="M102 59l-14-14m64-12V17m47 42l14-14" fill="none"/>',
  bread: '<g transform="rotate(-30 150 120)"><rect x="39" y="86" width="222" height="71" rx="35" fill="#DEAC55"/><path d="M90 94l15 39m30-39l15 39m30-39l15 39m30-39l15 39" fill="none" stroke="#FFF0C7" stroke-width="9"/></g>',
  croissant: '<path d="M54 145q4-84 96-89q92 5 96 89l-38 32l-23-31l-35 11l-35-11l-23 31z" fill="#DEAC55"/><path d="M102 73l13 73m82-73l-12 73m-35-89v99M66 108l29 51m139-51l-28 51" fill="none" stroke="#9C713A"/>',
  bag: '<path d="M91 81h118l15 121H76z" fill="#DDBB7B"/><path d="M120 83V59q0-33 30-33t30 33v24" fill="none"/><circle cx="150" cy="142" r="29" fill="#F9D936"/><path d="M136 140q14-19 28 0q-2 13-14 19q-12-6-14-19" fill="#82B78D"/>',
  thanks: '<rect x="63" y="62" width="174" height="132" rx="9" fill="#FFFDF7"/><path d="M107 112q20-35 43-5q23-30 43 5q3 25-43 50q-46-25-43-50" fill="#D9896F"/><path d="M92 42l-8-14m65 5V16m59 27l10-13" fill="none"/>',
};

export function Illustration({ picture, alt, size = 230 }: { picture: Vocabulary['picture']; alt: string; size?: number }) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="240" viewBox="0 0 300 240"><g stroke="#333D31" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">${drawings[picture]}</g></svg>`;
  return <Image accessibilityRole="img" accessibilityLabel={alt} source={{ uri: `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}` }} style={{ width: size, height: size * 0.8, maxWidth: '100%', alignSelf: 'center' }} resizeMode="contain" />;
}
