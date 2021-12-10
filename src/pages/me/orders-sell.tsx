import { useEffect, useState } from 'react'
import { ActiveTab, MenuOfMe } from './index'
import SellOrder from './SellOrder'
import { logPageView } from '../../functions/analysis'

function Index() {
  const [activeTab, setActiveTab] = useState(ActiveTab.ME)

  useEffect(() => {
    logPageView()
  }, [])

  return (
    <>
      <MenuOfMe activeTab={ActiveTab.ORDER_SELL} setActiveTab={setActiveTab} />
      <SellOrder />
    </>
  )
}

export default Index
