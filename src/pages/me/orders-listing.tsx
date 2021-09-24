import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import { CheckIcon, AdjustmentsIcon } from '@heroicons/react/solid'
import { Fragment, useState } from 'react'
import { Listbox, Transition } from '@headlessui/react'

const filterOptions = [
  { title: 'All', current: true },
  // ^ all orders
  { title: 'Active', current: false },
  // ^ not expired && not completed && not canceled
  { title: 'Action Required', current: false },
  // ^ expired || pending claim
  { title: 'Sells', current: false },
  // ^ sell strategy
  { title: 'Auctions', current: false },
  // ^ auction strategy
  { title: 'Completed', current: false },
  // ^ completed
  { title: 'Canceled', current: false }
  // ^ canceled
]

function Orders() {
  const [selected, setSelected] = useState(filterOptions[0])
  return (
    <>
      <div className="page-header">
        <div>
          <h2>Sell Orders</h2>
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
                <span>Sell</span>
              </div>
              <div className="extra">
                <span>Active</span>
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
                        <dd>123,123,123.00 NEW</dd>
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
                <div className="label">Price</div>
                <div className="price">123,123.00 NEW</div>
              </div>
              <div>
                <button type="button" className="primary small yellow">
                  Cancel
                </button>
              </div>
            </div>
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Sell</span>
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
                        <dd>123,123,123.00 NEW</dd>
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
                <span>Sell</span>
              </div>
              <div className="extra">
                <span className="gray">Canceled</span>
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
                        <dd>123,123,123.00 NEW</dd>
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
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Auction</span>
              </div>
              <div className="extra">
                <span>Ends in 122d 12h 9s</span>
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
                        <dd>123,123 NEW</dd>
                      </div>
                      <div>
                        <dt>No. Bids</dt>
                        <dd>0</dd>
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
                <div className="label">Starting Price</div>
                <div className="price">123,123 NEW</div>
              </div>
              <div>
                <button type="button" className="primary small yellow">
                  Cancel
                </button>
              </div>
            </div>
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Auction</span>
              </div>
              <div className="extra">
                <span className="gray">Canceled</span>
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
                        <dd>0</dd>
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
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Auction</span>
              </div>
              <div className="extra">
                <span>Ends in 122d 12h 9s</span>
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
                <div className="label">Highest Bid</div>
                <div className="price">123,123 NEW</div>
              </div>
              <div>
                <button type="button" className="primary small yellow">
                  View
                </button>
              </div>
            </div>
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Auction</span>
              </div>
              <div className="extra">
                <span className="red">Claim ends in 122d 12h 9s</span>
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
                <div className="label">Highest Bid</div>
                <div className="price">123,123 NEW</div>
              </div>
              <div></div>
            </div>
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Auction</span>
              </div>
              <div className="extra">
                <span>Expired</span>
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
                <div className="label">Highest Bid</div>
                <div className="price">123,123 NEW</div>
              </div>
              <div>
                <button type="button" className="primary small yellow">
                  Cancel Auction
                </button>
              </div>
            </div>
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Auction</span>
              </div>
              <div className="extra">
                <span className="gray">Canceled</span>
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
                        <dt>Highest Bid</dt>
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
          </li>

          <li>
            <div className="head">
              <div className="type">
                <span>Auction</span>
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
                  <h3>Token Name Token Name Token Name Token Name Token Name Token Name Token Name1</h3>
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
                        <dd>12121212.00 NEW</dd>
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
                <div className="label">Highest Bid</div>
                <div className="price">123,123 NEW</div>
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
