// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import axios from 'axios'

export default (req, res) => {
  const {url} = req.query
  axios.get(url)
    .then((response)=> {
      console.log(response)
      res.status(200).json(response.data)
    })
    .catch(error=>{
      res.status(400).json({ name: 'Error' })
    })
}

