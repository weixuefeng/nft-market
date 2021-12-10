import { useEffect, useState } from 'react'
import { ActiveTab, MenuOfMe } from './index'
import BuyOrder from './BuyOrder'
import { logPageView } from '../../functions/analysis'

function Index() {
  const [activeTab, setActiveTab] = useState(ActiveTab.ME)

  useEffect(() => {
    logPageView()
  }, [])

  return (
    <>
      <MenuOfMe activeTab={ActiveTab.ORDER_BUY} setActiveTab={setActiveTab} />
      <BuyOrder />
    </>
  )
}

export default Index
