import React from 'react'

const MainLoadingView = props => {
  return (
    <>
      <div className="flex h-screen">
        <div className="m-auto">
          <img src="/image/NewMallLogo.svg" className="w-24 h-24 animate-bounce" alt="" />
        </div>
      </div>
    </>
  )
}
export default MainLoadingView
