import { useState } from 'react'
import { ActiveTab, MenuOfMe } from './index'
import BuyOrder from './BuyOrder'

function Index() {
  const [activeTab, setActiveTab] = useState(ActiveTab.ME)

  return (
    <>
      <MenuOfMe activeTab={ActiveTab.ORDER_BUY} setActiveTab={setActiveTab} />
      <BuyOrder />
    </>
  )
}

export default Index
