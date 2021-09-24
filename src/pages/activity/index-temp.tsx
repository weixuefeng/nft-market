import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import {
  ArrowSmRightIcon,
  ShoppingCartIcon,
  HandIcon,
  TagIcon,
  SwitchHorizontalIcon,
  XCircleIcon,
  CheckIcon,
  AdjustmentsIcon
} from '@heroicons/react/solid'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'

const filterOptions = [
  { title: 'All', current: true },
  { title: 'Sale', current: false },
  { title: 'Auction', current: false },
  { title: 'Buy', current: false },
  { title: 'Bid', current: false }
]

const lists = [
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'sale',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'cancel sale',
    amount: '',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'buy',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'auction',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'cancel auction',
    amount: '',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'bid',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'claim auction',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'transfer',
    amount: '',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  },
  {
    id: 1,
    event: 'event',
    amount: '123456789123456789 NEW',
    contract: 'Contract Name',
    tokenId: 12,
    tokenName: 'Token Name',
    from: 'NEW182···1234',
    to: 'NEW182···1234',
    time: 'xxx ago'
  }
]

export default function Activity() {
  const [selected, setSelected] = useState(filterOptions[0])
  return (
    <>
      <div className="page-header">
        <div>
          <h2>Activity</h2>
        </div>

        <div className="flex">
          <ActivityFilter selected={selected} setSelected={setSelected} />
        </div>
      </div>

      <div className="activity-list">
        <ul role="list">
          {lists.map(list => (
            <li>
              <div>
                <div>
                  <div className="a">
                    <div className={'event ' + list.event}>
                      <p>
                        <ShoppingCartIcon />
                        {list.event}
                      </p>
                    </div>
                    <div className="amount">
                      <p>{list.amount}</p>
                    </div>
                  </div>

                  <div className="b">
                    <Link href="#">
                      <a>
                        <img src="https://source.unsplash.com/random/100x100" />
                        <div className="item">
                          <p>{list.tokenName}</p>
                          <p>
                            {list.contract} (#{list.tokenId})
                          </p>
                        </div>
                      </a>
                    </Link>
                  </div>

                  <div className="c">
                    <div>
                      <p>
                        {list.from} <ArrowSmRightIcon /> {list.to}
                      </p>
                    </div>
                    <p className="time">{list.time}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <button className="tertiary outline small">load more</button>

      <div className="activity-list-legends">
        <p>Legends</p>
        <p>
          <ShoppingCartIcon /> Buy / Claim
        </p>
        <p>
          <TagIcon /> Sale / Auction
        </p>
        <p>
          <XCircleIcon /> Cancel Sale/Auction
        </p>
        <p>
          <HandIcon /> Bid
        </p>
        <p>
          <SwitchHorizontalIcon /> Transfer
        </p>
      </div>
    </>
  )
}

const ActivityFilter = props => {
  return (
    <nav className="subnav">
      <div className="menu"></div>
      <div className="options">
        <ActivityFilterMenu {...props} />
      </div>
    </nav>
  )
}

const ActivityFilterMenu = props => {
  let { t } = useTranslation()
  const { selected, setSelected } = props

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <div className="filter-menu">
          <Listbox.Button className="dropdown-btn">
            <span>{t(selected.title)}</span>
            <AdjustmentsIcon />
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options>
              {filterOptions.map(option => (
                <Listbox.Option
                  key={option.title}
                  className={({ active }) => (active ? 'active' : 'inactive')}
                  value={option}
                >
                  <p>{t(option.title)}</p>
                  <CheckIcon className="check-icon" />
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  )
}
