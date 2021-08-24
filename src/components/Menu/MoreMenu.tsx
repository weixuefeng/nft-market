import { Menu, Transition } from '@headlessui/react'
import { DotsHorizontalIcon } from '@heroicons/react/outline'
import React, { Fragment } from 'react'

const MoreMenu = props => {
  return (
    <Menu as="div" className="more_menu">
      {({ open }) => (
        <>
          <Menu.Button className="menu_button">
            <DotsHorizontalIcon aria-hidden="true" />
          </Menu.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items static className="items">
              {props.children}
            </Menu.Items>
          </Transition>
        </>
      )}
    </Menu>
  )
}

export default MoreMenu
