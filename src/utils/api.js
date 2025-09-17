import axios from 'axios'

export const predictXray = (formData) =>
  axios.post('/api/predict', formData)

export const submitFeedback = (data) =>
  axios.post('/api/feedback', data)
