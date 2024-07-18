import { BluJayTheme, OrderType, SortType } from "./types";

export const videoMimeTypeList = [
  { name: "video/3gpp2", types: ["3g2"] },
  { name: "video/3gpp", types: ["3gp"] },
  { name: "video/x-ms-asf", types: ["asf", "asx"] },
  { name: "video/x-msvideo", types: ["avi"] },
  { name: "video/x-f4v", types: ["f4v"] },
  { name: "video/vnd.fvt", types: ["fvt"] },
  { name: "video/h261", types: ["h261"] },
  { name: "video/h263", types: ["h263"] },
  { name: "video/h264", types: ["h264"] },
  { name: "video/x-ms-wm", types: ["wm"] },
  { name: "video/x-ms-wmv", types: ["wmv"] },
  { name: "video/x-ms-wmx", types: ["wmx"] },
  { name: "video/x-ms-wvx", types: ["wvx"] },
  { name: "video/mpeg", types: ["m1v", "m2v", "mpa", "mpe", "mpeg", "mpg"] },
  { name: "video/vnd.mpegurl", types: ["m4u", "mxu"] },
  { name: "video/x-m4v", types: ["m4v"] },
  { name: "video/vnd.ms-playready.media.pyv", types: ["pyv"] },
  { name: "video/mj2", types: ["mj2", "mjp2"] },
  { name: "video/quicktime", types: ["mov", "qt"] },
  { name: "video/mp4", types: ["mp4", "mp4v", "mpg4"] },
  { name: "video/vnd.vivo", types: ["viv"] },
  { name: "video/mp2t", types: ["ts"] },
  { name: "video/x-matroska", types: ["mkv"] },
];

export const imageMimeTypeList = [
  { name: "image/avif", types: ["avif", "avifs"] },
  { name: "image/heic", types: ["heif", "heic"] },
  { name: "image/x-icns", types: ["icns"] },
  { name: "image/bmp", types: ["bmp"] },
  { name: "image/prs.btif", types: ["btif"] },
  { name: "image/cgm", types: ["cgm"] },
  { name: "image/x-cmx", types: ["cmx"] },
  { name: "image/vnd.djvu", types: ["djv", "djvu"] },
  { name: "image/vnd.dwg", types: ["dwg"] },
  { name: "image/vnd.dxf", types: ["dxf"] },
  { name: "image/x-freehand", types: ["fh", "fh4", "fh5", "fh7", "fhc"] },
  { name: "image/vnd.fastbidsheet", types: ["fbs"] },
  { name: "image/vnd.fpx", types: ["fpx"] },
  { name: "image/vnd.fst", types: ["fst"] },
  { name: "image/g3fax", types: ["g3"] },
  { name: "image/gif", types: ["gif"] },
  { name: "image/x-icon", types: ["ico"] },
  { name: "image/ief", types: ["ief"] },
  { name: "image/jpeg", types: ["jpe", "jpeg", "jpg", "pjpg", "jfif", "jfif-tbnl", "jif"] },
  { name: "image/pjpeg", types: ["jpe", "jpeg", "jpg", "pjpg", "jfi", "jfif", "jfif-tbnl", "jif"] },
  { name: "image/jpm", types: ["jpgm", "jpm"] },
  { name: "image/jpeg", types: ["jpgv"] },
  { name: "image/vnd.ms-modi", types: ["mdi"] },
  { name: "image/mj2", types: ["mj2", "mjp2"] },
  { name: "image/vnd.fujixerox.edmics-mmr", types: ["mmr"] },
  { name: "image/quicktime", types: ["mov", "qt"] },
  { name: "image/vnd.net-fpx", types: ["npx"] },
  { name: "application/vnd.oasis.opendocument.image", types: ["odi"] },
  { name: "image/ogg", types: ["ogv"] },
  { name: "image/webm", types: ["webm"] },
  { name: "image/webp", types: ["webp"] },
  { name: "application/vnd.oasis.opendocument.image-template", types: ["oti"] },
  { name: "image/x-portable-bitmap", types: ["pbm"] },
  { name: "image/x-pict", types: ["pct", "pic"] },
  { name: "image/x-pcx", types: ["pcx"] },
  { name: "image/x-portable-graymap", types: ["pgm"] },
  { name: "image/png", types: ["png"] },
  { name: "image/x-png", types: ["png"] },
  { name: "image/vnd.mozilla.apng", types: ["png"] },
  { name: "image/x-portable-anymap", types: ["pnm"] },
  { name: "image/x-portable-pixmap", types: ["ppm"] },
  { name: "image/vnd.adobe.photoshop", types: ["psd"] },
  { name: "image/vnd.wap.wbmp", types: ["wbmp"] },
  { name: "image/x-xbitmap", types: ["xbm"] },
  { name: "image/vnd.xiff", types: ["xif"] },
  { name: "image/x-xpixmap", types: ["xpm"] },
  { name: "image/x-xwindowdump", types: ["xwd"] },
  { name: "image/x-adobe-dng", types: ["dng"] },
  { name: "image/x-sony-arw", types: ["arw"] },
  { name: "image/x-canon-cr2", types: ["cr2"] },
  { name: "image/x-canon-crw", types: ["crw"] },
  { name: "image/x-kodak-dcr", types: ["dcr"] },
  { name: "image/x-epson-erf", types: ["erf"] },
  { name: "image/x-kodak-k25", types: ["k25"] },
  { name: "image/x-kodak-kdc", types: ["kdc"] },
  { name: "image/x-minolta-mrw", types: ["mrw"] },
  { name: "image/x-nikon-nef", types: ["nef"] },
  { name: "image/x-olympus-orf", types: ["orf"] },
  { name: "image/x-pentax-pef", types: ["pef", "ptx"] },
  { name: "image/x-fuji-raf", types: ["raf"] },
  { name: "image/x-panasonic-raw", types: ["raw", "rw2", "rwl"] },
  { name: "image/x-sony-sr2", types: ["sr2"] },
  { name: "image/x-sony-srf", types: ["srf"] },
  { name: "image/x-sigma-x3f", types: ["x3f"] }
];

export const videoExtensions = videoMimeTypeList.flatMap(mimeType => mimeType.types);
export const imageExtensions = imageMimeTypeList.flatMap(mimeType => mimeType.types);
export const fileExtensions = [...videoExtensions, ...imageExtensions] as const;
export const videoMimeTypes = videoMimeTypeList.flatMap(mimeType => mimeType.name);
export const imageMimeTypes = imageMimeTypeList.flatMap(mimeType => mimeType.name);
export const fileMimeTypes = [...videoMimeTypes, ...imageMimeTypes] as const;
export const cookieOptions = ["isTheaterMode", "videoVolume", "authToken", "isSidebarEnabled", "isEditor"] as const;
export const queryField = ["name", "filename", "category", "description", "id"] as const;
export const viewType = ["List View", "Grid View"] as const;
export const sortOptions = ["Alphabetical", "Date Updated", "Date Uploaded", "File Size", "View Count"] as const;
export const sliderType = ["verticle", "horizontal"] as const;
export const orderOptions = ["Ascending", "Descending"] as const;
export const sizeReductionPercent = 50;

export const blujayTheme: BluJayTheme = {
  background: "#0e0e0f",
  backgroundContrast: "#181819",
  text: "white",
  textContrast: "#868686",
  textContrastLight: "#8c8c8c",
  highlightDark: "#3c81eb",
  highlightLight: "#04befe",
  hightlightSilver: "#afdcff",
  button: "#272727",
  error: "#ff0000"
} as const;

export const screenSizes = {
  largeScreenSize: 2560,
  mediumScreenSize: 1920,
  smallScreenSize: 1280,
  tabletScreenSize: 720,
  mobileScreenSize: 480,
} as const;