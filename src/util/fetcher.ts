export enum ApiMethods {
  'get' = 'GET',
  'post' = 'POST',
  'put' = 'PUT',
  'patch' = 'PATCH',
  'delete' = 'DELETE',
}
type ApiMethod = `${ApiMethods}`

export enum ApiContentTypes {
  'json' = 'application/json',
  'form' = 'application/x-www-form-urlencoded',
}
type ApiContentTypeKey = keyof typeof ApiContentTypes
type ApiContentType = `${ApiContentTypes}`

interface IBuildHeaderOptions {
  type: ApiContentTypeKey
  headerOptions?: Record<string, any>
  token?: string
}

interface IBuildFetcherOptions {
  type?: IBuildHeaderOptions['type']
  token?: IBuildHeaderOptions['token']
  headerOptions?: IBuildHeaderOptions['headerOptions']
  data?: any
}

function buildHeader(options: IBuildHeaderOptions) {
  const { type, token, headerOptions } = options
  const header = new Headers()

  let contentType: ApiContentType = 'application/json'
  switch (type) {
    case 'json':
      contentType = 'application/json'
      break
    case 'form':
      contentType = 'application/x-www-form-urlencoded'
      break
    default:
      contentType = 'application/json'
      break
  }
  header.append('Content-Type', contentType)

  if (token) {
    header.append('Token', token)
  }

  if (headerOptions && Object.keys(headerOptions)) {
    for (const [k, v] of Object.entries(headerOptions)) {
      header.append(k, v)
    }
  }

  return header
}

export function buildFetcher(
  method: ApiMethod,
  url: string,
  options: IBuildFetcherOptions = {},
) {
  if (!(url && method)) return

  const { type = 'json', token, headerOptions, data } = options
  const headers = buildHeader({
    type,
    token,
    headerOptions,
  })
  const fetchOptions: Record<string, any> = { method, headers }

  if (data) {
    fetchOptions['body'] = data
  }

  //TODO: form action
  return fetch(url, {
    ...fetchOptions,
  }).then((res) => res.json())
}

// T is the response type
// K is the request type which defaults to T
// export function useRestfulApi<T, K = T>(
//   url: string,
//   key: keyof T,
//   fetchOptions?: SWRConfiguration,
// ) {
//   const [loading, setIsLoading] = useState(true)

//   const loadingTimeout = () => {
//     setIsLoading(false)
//   }

//   const buildFetcher = () => {}

//   const fetch = useCallback(async (url: string) => {
//     const response = await fetch(url)
//     return response as T[]
//   }, [])

//   const { data, error, isValidating, mutate } = useSWR(url, fetch, {
//     fetchOptions,
//   })

//   const memoizedData = useMemo(() => (!isEmpty(data) ? data : []), [data])

//   useEffect(() => {
//     if (isValidating) {
//       setIsLoading(true)
//       return
//     }

//     setTimeout(loadingTimeout, 500)
//   }, [isValidating])

//   return {
//     fetch: {
//       data: memoizedData,
//       error,
//       loading,
//       mutate,
//     },
//   }
// }
