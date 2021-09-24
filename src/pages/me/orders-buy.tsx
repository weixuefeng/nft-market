import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { CheckIcon, AdjustmentsIcon } from '@heroicons/react/solid'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'

const filterOptions = [
  { title: 'All', current: true },
  // ^ all orders
  { title: 'Action Required', current: false },
  // ^ auction && pending claim
  { title: 'Buys', current: false },
  // ^ buy strategy
  { title: 'Auction Bids', current: false },
  // ^ auction strategy
  { title: 'Auction Ended', current: false },
  // ^ auction && timestamp > auction end time && h.bidder not me || claim expired
  { title: 'Auction Completed', current: false }
  // ^ auction && deal is me
]

function Orders() {
  const [selected, setSelected] = useState(filterOptions[0])
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
