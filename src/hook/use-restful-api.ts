import { useCallback, useEffect, useMemo, useState } from 'react'
import useSWR from 'swr'
import { isArray, isEmpty } from 'lodash-es'
import type { SWRConfiguration } from 'swr/_internal'

type RestfulApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface IBuildHeader {
  type: 'json' | 'form'
  token?: string
}

function buildHeader(params: IBuildHeader) {
  const { type, token } = params
  const header = new Headers()

  let contentType = ''
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

  return header
}

// T is the response type
// K is the request type which defaults to T
export function useRestfulApi<T, K = T>(
  url: string,
  key: keyof T,
  fetchOptions?: SWRConfiguration,
) {
  const [loading, setIsLoading] = useState(true)

  const loadingTimeout = () => {
    setIsLoading(false)
  }

  const buildFetcher = () => {}

  const fetch = useCallback(async (url: string) => {
    const response = await fetch(url)
    return response as T[]
  }, [])

  const { data, error, isValidating, mutate } = useSWR(url, fetch, {
    fetchOptions,
  })

  const memoizedData = useMemo(() => (!isEmpty(data) ? data : []), [data])

  useEffect(() => {
    if (isValidating) {
      setIsLoading(true)
      return
    }

    setTimeout(loadingTimeout, 500)
  }, [isValidating])

  return {
    fetch: {
      data: memoizedData,
      error,
      loading,
      mutate,
    },
  }
}
