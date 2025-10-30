import { useAuth } from '../context/AuthContext'
import { toast } from "react-toastify";


const useAuthCheck = () => {

    const { currentUser } = useAuth()
    const validateLogin = () => {
        if(!currentUser)
        {
            toast.error("you must be logged in", {position: "bottom-right"})
            return false
        } else return true
    }
  return (
    {
        validateLogin
    }
  )
}

export default useAuthCheck