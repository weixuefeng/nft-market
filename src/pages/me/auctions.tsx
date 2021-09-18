import { useState } from 'react'
import { MyAuctions } from '../../components/lists/MyAuctions'
import { ActiveTab, MenuOfMe } from './index'

function Index() {
  const [activeTab, setActiveTab] = useState(ActiveTab.ME)
  return (
    <>
      <MenuOfMe activeTab={ActiveTab.MY_AUCTION} setActiveTab={setActiveTab} />
      <MyAuctions />
    </>
  )
}

export default Index
