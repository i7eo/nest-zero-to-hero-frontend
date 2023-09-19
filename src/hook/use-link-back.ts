import { useNavigate } from 'react-router-dom'

function useLinkBack() {
  const navigate = useNavigate()
  // 💡 Verify if previous page exists before using router.back
  const hasPreviousPage = window.history.length > 1

  const linkBackFn = () => {
    if (hasPreviousPage) {
      navigate(-1)
    } else {
      // fallback to a meaningful route.
      navigate('/')
    }
  }

  return linkBackFn
}

export default useLinkBack
