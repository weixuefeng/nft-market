import { useState } from 'react'
import { ActiveTab, MenuOfMe } from './index'
import SellOrder from './SellOrder'

function Index() {
  const [activeTab, setActiveTab] = useState(ActiveTab.ME)
  return (
    <>
      <MenuOfMe activeTab={ActiveTab.ORDER_SELL} setActiveTab={setActiveTab} />
      <SellOrder />
    </>
  )
}

export default Index
