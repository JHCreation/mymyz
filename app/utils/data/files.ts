const readFileAsText = (file, method) => new Promise( (resolve,reject)=> {
  let fr = new FileReader();
  method && fr[method](file);
  fr.onload = ()=> resolve(fr.result);
  fr.onerror = ()=> reject(fr);
});


const loadVideo = file => new Promise((resolve, reject) => {
  try {
    let video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = function () {
      resolve(this)
    }

    video.onerror = function () {
      resolve(this)
      // reject("Invalid video. Please select a video file.")
    }

    video.src = window.URL.createObjectURL(file)
  } catch (e) {
    reject(e)
  }
})

const mimeTypeList= {
  "aac": "audio/aac",
  "abw": "application/x-abiword",
  "ai": "application/postscript",
  "arc": "application/octet-stream",
  "avi": "video/x-msvideo",
  "azw": "application/vnd.amazon.ebook",
  "bin": "application/octet-stream",
  "bz": "application/x-bzip",
  "bz2": "application/x-bzip2",
  "csh": "application/x-csh",
  "css": "text/css",
  "csv": "text/csv",
  "doc": "application/msword",
  "dll": "application/octet-stream",
  "eot": "application/vnd.ms-fontobject",
  "epub": "application/epub+zip",
  "gif": "image/gif",
  "htm": "text/html",
  "html": "text/html",
  "ico": "image/x-icon",
  "ics": "text/calendar",
  "jar": "application/java-archive",
  "jpeg": "image/jpeg",
  "jpg": "image/jpeg",
  "js": "application/javascript",
  "json": "application/json",
  "mid": "audio/midi",
  "midi": "audio/midi",
  "mov": "video/quicktime",
  "mp2": "audio/mpeg",
  "mp3": "audio/mpeg",
  "mp4": "video/mp4",
  "mpa": "video/mpeg",
  "mpe": "video/mpeg",
  "mpeg": "video/mpeg",
  "mpkg": "application/vnd.apple.installer+xml",
  "odp": "application/vnd.oasis.opendocument.presentation",
  "ods": "application/vnd.oasis.opendocument.spreadsheet",
  "odt": "application/vnd.oasis.opendocument.text",
  "oga": "audio/ogg",
  "ogv": "video/ogg",
  "ogx": "application/ogg",
  "otf": "font/otf",
  "png": "image/png",
  "pdf": "application/pdf",
  "ppt": "application/vnd.ms-powerpoint",
  "rar": "application/x-rar-compressed",
  "rtf": "application/rtf",
  "sh": "application/x-sh",
  "svg": "image/svg+xml",
  "swf": "application/x-shockwave-flash",
  "tar": "application/x-tar",
  "tif": "image/tiff",
  "tiff": "image/tiff",
  "ts": "application/typescript",
  "ttf": "font/ttf",
  "txt": "text/plain",
  "vsd": "application/vnd.visio",
  "wav": "audio/x-wav",
  "weba": "audio/webm",
  "webm": "video/webm",
  "webp": "image/webp",
  "wmv": "video/x-ms-wmv",
  "woff": "font/woff",
  "woff2": "font/woff2",
  "xhtml": "application/xhtml+xml",
  "xls": "application/vnd.ms-excel",
  "xlsx": "application/vnd.ms-excel",
  "xlsx_OLD": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "xml": "application/xml",
  "xul": "application/vnd.mozilla.xul+xml",
  "zip": "application/zip",
  "3gp": "video/3gpp",
  "3gp_DOES_NOT_CONTAIN_VIDEO": "audio/3gpp",
  "3gp2": "video/3gpp2",
  "3gp2_DOES_NOT_CONTAIN_VIDEO": "audio/3gpp2",
  "7z": "application/x-7z-compressed"
}

export { readFileAsText, loadVideo, mimeTypeList }