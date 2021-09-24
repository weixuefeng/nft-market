import { useState } from 'react'
import { MyBids } from '../../components/lists/MyBids'
import { ActiveTab, MenuOfMe } from './index'

function Index() {
  const [activeTab, setActiveTab] = useState(ActiveTab.ME)

  return (
    <>
      <MenuOfMe activeTab={ActiveTab.MY_BID} setActiveTab={setActiveTab} />
      <MyBids />
    </>
  )
}

export default Index
