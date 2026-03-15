/**
 * Gallery & video data.
 *
 * - **Links (VIDEOS, CATWALK_VIDEOS, etc.)** are stable URLs. The browser caches by link;
 *   we never change or cache-bust them, so cached videos are reused for a faster, cheaper load.
 * - **Random order** is only the arrangement of those same links. CATWALK_MEDIA, EDITORIAL_MEDIA,
 *   HERO_MEDIA are shuffled at module load, so every full page refresh gets a new order; the
 *   shuffled array is not persisted. The UI still pulls from the same cached-by-link videos.
 */

/** Max playback length (seconds) for hero/course background videos; transition to next after this. */
export const BACKGROUND_VIDEO_MAX_SECONDS = 7

/** Number of most recently played videos to exclude from the pool until they "exit" the window. */
export const BACKGROUND_VIDEO_RECENT_COUNT = 3

export const VIDEOS = [
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739808/WhatsApp_Video_2026-02-24_at_1.09.39_PM_upgoek.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739801/WhatsApp_Video_2026-02-24_at_1.09.42_PM_hqvjab.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739801/WhatsApp_Video_2026-02-24_at_1.09.21_PM_gzdinb.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739791/WhatsApp_Video_2026-02-24_at_1.09.23_PM_aeguij.mp4',
  // 'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739660/c9bce72a-a0e1-48a8-bc0d-7c22f48c0a02_o8newb.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739597/b1622b9a-ddcb-408c-9f6f-96307071ca88_zw6lus.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739587/bea21f76-3146-440f-aa0d-0ee455145b15_xhumdd.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739559/acd8b7a4-648b-42b3-9d85-f13e8ea28a52_dahzs0.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739550/97413b02-42f0-461e-bbb7-61bf56f21e26_eomsuk.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739503/6597d819-82b9-41ee-909b-82e1297bd0cc_hpkbyo.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739437/9cb55d33-81ed-4235-9a44-6b39f4826616_rt7ahf.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739385/3fc61bd8-2f74-42a5-8a12-444f41229c37_zpqlsf.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739393/c14d7b71-3a71-4fb4-91dc-82bf01add258_ly3ki1.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738661/SnapInsta.to_AQPtROaIxYpTnmrG5gYyXcZjGiD48NcP5zZDtIie26V0uuysFdGBnJ7bu5hEhOW8D3Ab4Qn01jPgTmHI48XKOcEl_ff3agd.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738660/SnapInsta.to_AQMhww-y8LGif18Ao6ryEMvqGWzBaYDilwXOc8__84NYkVizy_j0ezgqulJyp5_8S1vTeLK85LfSf10tGw38-L5C_begzog.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738658/SnapInsta.to_AQNSc5d9F5Z3SGEpc9v7bz3nWF6OYYIany9PJWVuf5oMeNINxhS__4wJpIKz58A5vfppR6ERxSllEIHBHXnGCjkoryk7SLWT3nt-AtE_ztzawj.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738658/SnapInsta.to_AQPnrJCfWMiPSwq881LXnCoSPKo7xhRO7g_Xy8oOSWbLJLa0TiheBoIJvwLk2PoN-XQ2PpdQuDsgYmfQ0fjyOV5DR0gfZT2p8Leomy0_hwykcv.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738657/SnapInsta.to_AQOPctXf60kkq_Tf_sNT4h8ftLXhq6l6gkod16-rDED2POA33-GsnzqYxOVFvJRXafVKUDTOzn7dA1Xntbr2kx5OTTY4VVVJ2QiMhHk_hdojbu.mp4',
]

export const IMAGES = [
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738657/SnapInsta.to_645820956_18062292653673356_3911402741580432231_n_zlayeg.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738657/SnapInsta.to_645734039_18062292644673356_2939021230728017371_n_njrcak.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738656/SnapInsta.to_642647919_18062292662673356_3669437639800723291_n_o0yc4f.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738656/SnapInsta.to_642624091_18062292671673356_3725490651833664552_n_gqfwew.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826713/efb1df05-1261-4ce4-8df0-2884890f59f7_did6xq.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826710/e43d2372-8ffd-4d47-a99f-10e1c7190739_ojcij9.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826710/e4dc543d-4293-4ea8-988a-64e270a51427_zsbd2h.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826708/d63bc34f-7c20-4cb2-9187-098f65ad2695_n8latr.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826706/c757335e-c736-4079-adcc-123303a37e01_tawzmb.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826705/bfe23419-0336-4ed4-b736-ad3b67a33b60_k904wi.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826815/32f98bd0-58a4-485f-a4c0-a3648936f3d8_aygxyb.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826814/9bb714c2-7b1b-45bb-8b20-8de8f692ce58_ellqwd.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826817/34ccfe70-d2b0-4c76-9009-dbe2f220816c_albwd0.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826813/016bebc7-b11d-4006-8046-7e72c019c921_qbhpxx.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826817/52b8e983-1f2d-43c7-8c6a-4697b50e347b_cwwhur.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826819/058dfc59-967b-4439-a5b7-eaca98d0e81e_cven62.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826818/52d0cf5a-26af-4124-ac11-4720a65c64fa_p3vqrl.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826819/58dfd727-d9c7-4b4e-b05c-913905c540bf_lckghg.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826819/68be2ad4-5422-4471-a48a-3bede2585fe9_pmkstj.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826820/70da40da-963f-4430-adbf-091b53031c71_kzm7yz.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826820/73af7265-06cf-44a8-b899-8e57fda1350f_hmfpdl.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826703/becacaf7-9485-43b2-aa27-9fb3adc25f55_xpvwgw.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826705/c1bc26d8-a1f1-4f7c-92d8-eff597844e03_tokmfw.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826702/822461b8-cd4d-44ac-bbb5-de27b66add08_yogqkf.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826702/badaaf11-d001-4aac-ba53-425bb1595991_bwyzcr.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826700/b687851c-7f07-4e2d-b29f-48421989f20d_uw2x07.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826702/53679a66-ec30-49ad-8ac9-c835244858e5_ibfdys.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826698/8745d5fa-25ce-472e-aa9a-23a1a318a0be_juidkh.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826698/6679fe4a-dbf2-4506-ab10-46c99255e90b_qchkl5.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826699/58875f7d-7b0c-4b04-bdf8-c9c0589442f5_omw88f.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826696/98765580-80ef-4cec-b16a-7783e5af1e6f_dkwbkw.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826694/542f5c39-11eb-481e-9120-384f3ae98f71_wijas4.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772826693/07097389-aa79-4b05-b00d-c96c8f2c20ee_z8tdsp.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738656/SnapInsta.to_640315642_18061240670673356_3079675055752799357_n_zlhkmp.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738656/SnapInsta.to_514434667_18033987794673356_5170088275445025950_n_slw4up.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1772738656/SnapInsta.to_620483202_18057619997673356_2630186142050548869_n_aw5urt.jpg',
  'https://res.cloudinary.com/ddnlbizum/image/upload/v1771771028/SaveClip.App_618135322_18098988136893332_3370589530317688738_n_ebtook.webp',
]

export const CATWALK_VIDEOS = [
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738658/SnapInsta.to_AQPnrJCfWMiPSwq881LXnCoSPKo7xhRO7g_Xy8oOSWbLJLa0TiheBoIJvwLk2PoN-XQ2PpdQuDsgYmfQ0fjyOV5DR0gfZT2p8Leomy0_hwykcv.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739597/b1622b9a-ddcb-408c-9f6f-96307071ca88_zw6lus.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738660/SnapInsta.to_AQMhww-y8LGif18Ao6ryEMvqGWzBaYDilwXOc8__84NYkVizy_j0ezgqulJyp5_8S1vTeLK85LfSf10tGw38-L5C_begzog.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738658/SnapInsta.to_AQNSc5d9F5Z3SGEpc9v7bz3nWF6OYYIany9PJWVuf5oMeNINxhS__4wJpIKz58A5vfppR6ERxSllEIHBHXnGCjkoryk7SLWT3nt-AtE_ztzawj.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739402/5bccecbb-77e8-4cc3-bd27-427fddf3c94a_lwqpxf.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739476/87d31cbd-17f7-4467-8570-4495fcf7ec96_qycbwh.mov',
  // 'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739660/c9bce72a-a0e1-48a8-bc0d-7c22f48c0a02_o8newb.mov',
  // 'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739501/9f0cba07-5ac6-4027-aa8e-07794cb4a63f_qpcrpo.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739808/WhatsApp_Video_2026-02-24_at_1.09.39_PM_upgoek.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739791/WhatsApp_Video_2026-02-24_at_1.09.23_PM_aeguij.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739801/WhatsApp_Video_2026-02-24_at_1.09.42_PM_hqvjab.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739397/1ded101b-2f9f-4cca-9aba-01b02026e545_xi6c4i.mov',
  // 'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739597/b1622b9a-ddcb-408c-9f6f-96307071ca88_zw6lus.mov',
]

export const EDITORIAL_VIDEOS = [
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738661/SnapInsta.to_AQPtROaIxYpTnmrG5gYyXcZjGiD48NcP5zZDtIie26V0uuysFdGBnJ7bu5hEhOW8D3Ab4Qn01jPgTmHI48XKOcEl_ff3agd.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738660/SnapInsta.to_AQMhww-y8LGif18Ao6ryEMvqGWzBaYDilwXOc8__84NYkVizy_j0ezgqulJyp5_8S1vTeLK85LfSf10tGw38-L5C_begzog.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738658/SnapInsta.to_AQNSc5d9F5Z3SGEpc9v7bz3nWF6OYYIany9PJWVuf5oMeNINxhS__4wJpIKz58A5vfppR6ERxSllEIHBHXnGCjkoryk7SLWT3nt-AtE_ztzawj.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738658/SnapInsta.to_AQPnrJCfWMiPSwq881LXnCoSPKo7xhRO7g_Xy8oOSWbLJLa0TiheBoIJvwLk2PoN-XQ2PpdQuDsgYmfQ0fjyOV5DR0gfZT2p8Leomy0_hwykcv.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772738657/SnapInsta.to_AQOPctXf60kkq_Tf_sNT4h8ftLXhq6l6gkod16-rDED2POA33-GsnzqYxOVFvJRXafVKUDTOzn7dA1Xntbr2kx5OTTY4VVVJ2QiMhHk_hdojbu.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739393/c14d7b71-3a71-4fb4-91dc-82bf01add258_ly3ki1.mov',
]

export const HERO_VIDEOS = [
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739808/WhatsApp_Video_2026-02-24_at_1.09.39_PM_upgoek.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739791/WhatsApp_Video_2026-02-24_at_1.09.23_PM_aeguij.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739801/WhatsApp_Video_2026-02-24_at_1.09.42_PM_hqvjab.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739397/1ded101b-2f9f-4cca-9aba-01b02026e545_xi6c4i.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739479/367afd81-fe69-4412-9d71-049f0ffab969_z4eaq1.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739516/4957f44f-0204-492b-b0e8-b66e5a5770cb_yzkacr.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739550/97413b02-42f0-461e-bbb7-61bf56f21e26_eomsuk.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739559/acd8b7a4-648b-42b3-9d85-f13e8ea28a52_dahzs0.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739476/87d31cbd-17f7-4467-8570-4495fcf7ec96_qycbwh.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739808/WhatsApp_Video_2026-02-24_at_1.09.39_PM_upgoek.mp4',
  // 'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739801/WhatsApp_Video_2026-02-24_at_1.09.42_PM_hqvjab.mp4',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739597/b1622b9a-ddcb-408c-9f6f-96307071ca88_zw6lus.mov',
  'https://res.cloudinary.com/ddnlbizum/video/upload/v1772739808/WhatsApp_Video_2026-02-24_at_1.09.39_PM_upgoek.mp4',
]

/** Fisher–Yates shuffle; returns a new array in random order. Re-run on each load so the random order is cleared every refresh; items still reference the same URLs so the browser serves from cache. */
function shuffleArray<T>(array: T[]): T[] {
  const out = [...array]
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}

export type GalleryItem = { id: number; type: 'video' | 'image'; src: string; title: string }

/** Single list: total items = VIDEOS.length + IMAGES.length. One container per item. */
export const GALLERY_MEDIA: GalleryItem[] = [
  ...VIDEOS.map((src, i) => ({
    id: i + 1,
    type: 'video' as const,
    src,
    title: `Work ${String(i + 1).padStart(2, '0')}`,
  })),
  ...IMAGES.map((src, i) => ({
    id: VIDEOS.length + i + 1,
    type: 'image' as const,
    src,
    title: `Work ${String(VIDEOS.length + i + 1).padStart(2, '0')}`,
  })),
]

export type CATWALK_ITEM = { id: number; type: 'video'; src: string; title: string }
/** Base list from canonical links (cached by URL); order shuffled on each load. */
const catwalkMediaBase: CATWALK_ITEM[] = CATWALK_VIDEOS.map((src, i) => ({
  id: i + 1,
  type: 'video' as const,
  src,
  title: `Catwalk ${String(i + 1).padStart(2, '0')}`,
}))
export const CATWALK_MEDIA: CATWALK_ITEM[] = shuffleArray(catwalkMediaBase)

export type EDITORIAL_ITEM = { id: number; type: 'video'; src: string; title: string }
/** Base list from canonical links (cached by URL); order shuffled on each load. */
const editorialMediaBase: EDITORIAL_ITEM[] = EDITORIAL_VIDEOS.map((src, i) => ({
  id: i + 1,
  type: 'video' as const,
  src,
  title: `Editorial ${String(i + 1).padStart(2, '0')}`,
}))
export const EDITORIAL_MEDIA: EDITORIAL_ITEM[] = shuffleArray(editorialMediaBase)

export type HERO_ITEM = { id: number; type: 'video'; src: string; title: string }
/** Base list from canonical links (cached by URL); order shuffled on each load. */
const heroMediaBase: HERO_ITEM[] = HERO_VIDEOS.map((src, i) => ({
  id: i + 1,
  type: 'video' as const,
  src,
  title: `Hero ${String(i + 1).padStart(2, '0')}`,
}))
export const HERO_MEDIA: HERO_ITEM[] = shuffleArray(heroMediaBase)