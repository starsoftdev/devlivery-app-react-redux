import {LOCALE_COOKIE} from './constants'

const transformFormUrlEncoded = (body) => {
  const str = []
  for (let p in body) {
    const key = encodeURIComponent(p)
    const value = encodeURIComponent(body[p])
    str.push(`${key}=${value}`)
  }
  return str.join('&')
}

const transformFormData = (body) => {
  let formDataBody = new FormData()
  Object.keys(body).forEach((key) => {
    formDataBody.append(key, body[key])
  })
  return formDataBody
}

const prepareRequestHeaders = (cookies, contentType = 'application/json', token) => {
  const headers = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  headers['Accept'] = `application/json`
  headers['Content-Type'] = contentType
  const locale = cookies.get(LOCALE_COOKIE) || 'de-DE'
  headers['lang'] = locale.substring(0, 2) // 'en'
  return headers
}

const prepareRequestBody = (body, contentType) => {
  if (contentType === 'application/x-www-form-urlencoded') {
    return transformFormUrlEncoded(body)
  } else if (contentType === 'multipart/form-data') {
    return transformFormData(body)
  } else {
    return JSON.stringify(body)
  }
}

function openFile(blob, fileName, fileType) {
  // It is necessary to create a new blob object with mime-type explicitly set
  // otherwise only Chrome works like it should
  const newBlob = new Blob([blob], { type: fileType })

  // IE doesn't allow using a blob object directly as link href
  // instead it is necessary to use msSaveOrOpenBlob
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob, fileName)
    return
  }

  // For other browsers:
  // Create a link pointing to the ObjectURL containing the blob.
  const data = window.URL.createObjectURL(newBlob)
  const link = document.createElement('a')
  link.href = data
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  setTimeout(() => {
    // For Firefox it is necessary to delay revoking the ObjectURL
    document.body.removeChild(link)
    window.URL.revokeObjectURL(data)
  }, 100)
}

/**
 * Creates a wrapper function around the HTML5 Fetch API that provides
 * default arguments to fetch(...) and is intended to reduce the amount
 * of boilerplate code in the application.
 * https://developer.mozilla.org/docs/Web/API/Fetch_API/Using_Fetch
 */
function createFetch(fetch, {apiUrl, cookies}) {
  return async (url, {token, contentType, ...options}) => {
    const anotherDomainRequest = url.startsWith('http')
    options.body = prepareRequestBody(options.body, contentType)
    if (!anotherDomainRequest) {
      options.headers = prepareRequestHeaders(cookies, contentType, token)
    }
    try {
      console.log(anotherDomainRequest ? url : `${apiUrl}${url}`, {
        ...options,
        headers: {
          ...options.headers,
        },
      });
      const resp = await fetch(anotherDomainRequest ? url : `${apiUrl}${url}`, {
        ...options,
        headers: {
          ...options.headers,
        },
      })
      console.log("resp",resp);
      if(resp.status === 401)
      {
        window.location.href='/';
        return options.failure({})
      }
      if (options.fileName) {
        if (resp.ok) {
          const responseFile = await resp.blob()
          openFile(responseFile, options.fileName)
          options.success({})
        } else {
          options.failure({})
        }
      } else {
        const responseText = await resp.text()
        if (responseText) {
          const responseBody = JSON.parse(responseText)
          return resp.ok ? options.success(responseBody) : options.failure(responseBody)
        } else {
          return resp.ok ? options.success({}) : options.failure({})
        }
      }
    } catch (error) {
      console.log('error',error);
      return options.failure({error})
    }
  }
}

export default createFetch
