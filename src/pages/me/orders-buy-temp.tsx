import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { CheckIcon, AdjustmentsIcon } from '@heroicons/react/solid'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { useQuery } from '@apollo/client'
import { GET_BID_HISTORY } from 'services/queries/bidHistory'
import { pageShowSize, pageSize, POLLING_INTERVAL } from 'constant'
import { getBidOrderFilterByTitle } from 'functions/FilterOrderUtil'
import { useWeb3React } from '@web3-react/core'
import { BidderDataList } from 'entities'

export enum BidOrderFilter {
  ALL = "All",
  AUCTION_REQUIRED = "Auction Required",
  BUYS = "Buys",
  AUCTION_BID = "Auction Bids",
  AUCTION_ENDED = "Auction Ended",
  AUCTION_COMPLETED = "Auction Completed"
}

const filterOptions = [
  { title: BidOrderFilter.ALL, current: true },
  // ^ all orders
  { title: BidOrderFilter.AUCTION_REQUIRED, current: false },
  // ^ auction && pending claim
  { title: BidOrderFilter.BUYS, current: false },
  // ^ buy strategy
  { title: BidOrderFilter.AUCTION_BID, current: false },
  // ^ auction strategy
  { title: BidOrderFilter.AUCTION_ENDED, current: false },
  // ^ auction && timestamp > auction end time && h.bidder not me || claim expired
  { title: BidOrderFilter.AUCTION_COMPLETED, current: false }
  // ^ auction && deal is me
]

function Orders() {
  const [selected, setSelected] = useState(filterOptions[0])
  const {account} = useWeb3React()
  const [pageNumber, setPageNumber] = useState(1)
  const [orderData, setOrderData] = useState([])
  const [hasMore, setHasMore] = useState(true)

  let where = getBidOrderFilterByTitle(selected.title, account)

  const { data, error, loading, fetchMore } = useQuery<BidderDataList>(GET_BID_HISTORY, {variables: {
      skip: 0,
      first: pageSize,
      orderBy: 'createdAt',
      orderDirection: 'desc',
      where: where,
    },
    fetchPolicy: 'cache-and-network',
    pollInterval: POLLING_INTERVAL,
    onCompleted: res => {
      if (res.bidOrders.length > pageShowSize * pageNumber) {
        // has more
        res.bidOrders.pop()
        setHasMore(true)
        setOrderData(res.bidOrders)
      } else {
        setHasMore(false)
        setOrderData(res.bidOrders)
      }
    }
  })


  return (
    <>
      <div className="page-header">
        <div>
          <h2>Buy Orders</h2>
        </div>

        <div className="flex">
          <OrdersFilter selected={selected} setSelected={setSelected} />
        </div>
      </div>

      <section>
        <ul className="list orders">
          <li>
            <div className="head">
              <div className="type">
                <span>Buy</span>
              </div>
              <div className="extra">
                <span className="green">Completed</span>
              </div>
            </div>

            <div className="main">
              <a href="#">
                <div>
                  <img src="https://source.unsplash.com/random/200x200" />
                </div>

                <div>
                  <h3>Token Name Token Name Token Name Token Name Token Name Token Name Token Name</h3>
                  <p>Contract Name (#ID)</p>
                </div>
              </a>

              <div className="info">
                <dl>
                  <div>
                    <dt>Listing Detail</dt>
                    <dd>
                      <div>
                        <dt>Time</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                      <div>
                        <dt>Price</dt>
                        <dd>123,123.00 NEW</dd>
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt>Deal Detail</dt>
                    <dd>
                      <div>
                        <dt>Payee</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Payer</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Item From</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Item To</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Txn Time</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="footer">
              <div>
                <div className="label">Price</div>
                <div className="price">123,123 NEW</div>
              </div>
              <div></div>
            </div>
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Auction Bid</span>
              </div>
              <div className="extra">
                <span>Ends in #D #H #M #S</span>
              </div>
            </div>

            <div className="main">
              <a href="#">
                <div>
                  <img src="https://source.unsplash.com/random/200x200" />
                </div>

                <div>
                  <h3>Token Name Token Name Token Name Token Name Token Name Token Name Token Name</h3>
                  <p>Contract Name (#ID)</p>
                </div>
              </a>

              <div className="info">
                <dl>
                  <div>
                    <dt>Listing Detail</dt>
                    <dd>
                      <div>
                        <dt>Duration</dt>
                        <dd>#D #H #M #S</dd>
                      </div>
                      <div>
                        <dt>Start</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                      <div>
                        <dt>End</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                      <div>
                        <dt>Starting</dt>
                        <dd>123,123.00 NEW</dd>
                      </div>
                      <div>
                        <dt>No. Bids</dt>
                        <dd>12</dd>
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt>Deal Detail</dt>
                    <dd>
                      <div>
                        <dt>Payee</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Payer</dt>
                        <dd>-</dd>
                      </div>
                      <div>
                        <dt>Item From</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Item To</dt>
                        <dd>-</dd>
                      </div>
                      <div>
                        <dt>Txn Time</dt>
                        <dd>-</dd>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="footer">
              <div>
                <div className="label">My Bid</div>
                <div className="price">123,123 NEW</div>
                <div className="label">Highest Bid: Me / 123,123 NEW</div>
              </div>
              <div></div>
            </div>
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Auction Bid</span>
              </div>
              <div className="extra">
                <span>Ends in #D #H #M #S</span>
              </div>
            </div>

            <div className="main">
              <a href="#">
                <div>
                  <img src="https://source.unsplash.com/random/200x200" />
                </div>

                <div>
                  <h3>Token Name Token Name Token Name Token Name Token Name Token Name Token Name</h3>
                  <p>Contract Name (#ID)</p>
                </div>
              </a>

              <div className="info">
                <dl>
                  <div>
                    <dt>Listing Detail</dt>
                    <dd>
                      <div>
                        <dt>Duration</dt>
                        <dd>#D #H #M #S</dd>
                      </div>
                      <div>
                        <dt>Start</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                      <div>
                        <dt>End</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                      <div>
                        <dt>Starting</dt>
                        <dd>123,123.00 NEW</dd>
                      </div>
                      <div>
                        <dt>No. Bids</dt>
                        <dd>12</dd>
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt>Deal Detail</dt>
                    <dd>
                      <div>
                        <dt>Payee</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Payer</dt>
                        <dd>-</dd>
                      </div>
                      <div>
                        <dt>Item From</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Item To</dt>
                        <dd>-</dd>
                      </div>
                      <div>
                        <dt>Txn Time</dt>
                        <dd>-</dd>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="footer">
              <div>
                <div className="label">My Bid</div>
                <div className="price">123,123 NEW</div>
                <div className="label red">Highest Bid: 123,123 NEW</div>
              </div>
              <div>
                <button type="button" className="primary small yellow">
                  Raise Bid
                </button>
              </div>
            </div>
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Auction Bid</span>
              </div>
              <div className="extra">
                <span className="red">Claim expires in #D #H #M #S</span>
              </div>
            </div>

            <div className="main">
              <a href="#">
                <div>
                  <img src="https://source.unsplash.com/random/200x200" />
                </div>

                <div>
                  <h3>Token Name Token Name Token Name Token Name Token Name Token Name Token Name</h3>
                  <p>Contract Name (#ID)</p>
                </div>
              </a>

              <div className="info">
                <dl>
                  <div>
                    <dt>Listing Detail</dt>
                    <dd>
                      <div>
                        <dt>Duration</dt>
                        <dd>#D #H #M #S</dd>
                      </div>
                      <div>
                        <dt>Start</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                      <div>
                        <dt>End</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                      <div>
                        <dt>Starting</dt>
                        <dd>123,123.00 NEW</dd>
                      </div>
                      <div>
                        <dt>No. Bids</dt>
                        <dd>12</dd>
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt>Deal Detail</dt>
                    <dd>
                      <div>
                        <dt>Payee</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Payer</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Item From</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Item To</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Txn Time</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="footer">
              <div>
                <div className="label">My Bid</div>
                <div className="price">123,123 NEW</div>
                <div className="label">Highest Bid: Me / 123,123 NEW</div>
              </div>
              <div>
                <button type="button" className="primary small green">
                  Claim Item
                </button>
              </div>
            </div>
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Auction Bid</span>
              </div>
              <div className="extra">
                <span>Ended</span>
              </div>
            </div>

            <div className="main">
              <a href="#">
                <div>
                  <img src="https://source.unsplash.com/random/200x200" />
                </div>

                <div>
                  <h3>Token Name Token Name Token Name Token Name Token Name Token Name Token Name</h3>
                  <p>Contract Name (#ID)</p>
                </div>
              </a>

              <div className="info">
                <dl>
                  <div>
                    <dt>Listing Detail</dt>
                    <dd>
                      <div>
                        <dt>Duration</dt>
                        <dd>#D #H #M #S</dd>
                      </div>
                      <div>
                        <dt>Start</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                      <div>
                        <dt>End</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                      <div>
                        <dt>Starting</dt>
                        <dd>123,123.00 NEW</dd>
                      </div>
                      <div>
                        <dt>No. Bids</dt>
                        <dd>12</dd>
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt>Deal Detail</dt>
                    <dd>
                      <div>
                        <dt>Payee</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Payer</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Item From</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Item To</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Txn Time</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="footer">
              <div>
                <div className="label">My Bid</div>
                <div className="price">123,123 NEW</div>
                <div className="label">Highest Bid: 123,123 NEW</div>
              </div>
              <div></div>
            </div>
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Auction Bid</span>
              </div>
              <div className="extra">
                <span className="green">Completed</span>
              </div>
            </div>

            <div className="main">
              <a href="#">
                <div>
                  <img src="https://source.unsplash.com/random/200x200" />
                </div>

                <div>
                  <h3>Token Name Token Name Token Name Token Name Token Name Token Name Token Name</h3>
                  <p>Contract Name (#ID)</p>
                </div>
              </a>

              <div className="info">
                <dl>
                  <div>
                    <dt>Listing Detail</dt>
                    <dd>
                      <div>
                        <dt>Duration</dt>
                        <dd>#D #H #M #S</dd>
                      </div>
                      <div>
                        <dt>Start</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                      <div>
                        <dt>End</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                      <div>
                        <dt>Starting</dt>
                        <dd>123,123.00 NEW</dd>
                      </div>
                      <div>
                        <dt>No. Bids</dt>
                        <dd>12</dd>
                      </div>
                    </dd>
                  </div>
                  <div>
                    <dt>Deal Detail</dt>
                    <dd>
                      <div>
                        <dt>Payee</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Payer</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Item From</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Item To</dt>
                        <dd>NEW123...1234</dd>
                      </div>
                      <div>
                        <dt>Txn Time</dt>
                        <dd>1111-11-11 11:11:11</dd>
                      </div>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            <div className="footer">
              <div>
                <div className="label">My Bid</div>
                <div className="price">123,123 NEW</div>
                <div className="label">Highest Bid: Me / 123,123 NEW</div>
              </div>
              <div></div>
            </div>
          </li>
        </ul>
        <button className="tertiary outline small">load more</button>
      </section>
    </>
  )
}

export default Orders

const OrdersFilter = props => {
  return (
    <nav className="subnav">
      <div className="menu"></div>
      <div className="options">
        <FilterMenu {...props} />
      </div>
    </nav>
  )
}

const FilterMenu = props => {
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
