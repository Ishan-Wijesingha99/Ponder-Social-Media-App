import { useState } from 'react'



export const useForm = (callback, initialState = {}) => {

  const [formData, setFormData] = useState(initialState)



  const onChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value
    })
  }

  const onSubmit = event => {
    // prevent page from reloading when form is submitted
    event.preventDefault()

    // execute callback that is specific to the form in question
    callback()
  }

  return {
    onChange,
    onSubmit,
    formData
  }
}
