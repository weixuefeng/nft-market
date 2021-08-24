const React = require('react')

function NewMallLogo(props) {
  return (
    <svg
      viewBox="0 0 256 256"
      xmlns="http://www.w3.org/2000/svg"
      fill="url(#newmall-logo-gradient-001) #FBCE31"
      {...props}
    >
      <defs>
        <radialGradient cx="0%" cy="0%" fx="0%" fy="0%" r="141.421%" id="newmall-logo-gradient-001">
          <stop stopColor="#FCE13C" offset="0%" />
          <stop stopColor="#FCE13C" offset="15.848%" />
          <stop stopColor="#FCE13C" offset="27.217%" />
          <stop stopColor="#FCE13C" offset="42.386%" />
          <stop stopColor="#F9B924" offset="81.982%" />
          <stop stopColor="#F9B924" offset="99.956%" />
        </radialGradient>
      </defs>
      <path
        d="M128 0c70.692 0 128 57.308 128 128 0 70.692-57.308 128-128 128C57.308 256 0 198.692 0 128 0 57.308 57.308 0 128 0zm0 16C66.144 16 16 66.144 16 128s50.144 112 112 112 112-50.144 112-112S189.856 16 128 16zm0 8c57.438 0 104 46.562 104 104s-46.562 104-104 104S24 185.438 24 128 70.562 24 128 24zm-27 84a6 6 0 00-6 6v81a6 6 0 0012 0v-81a6 6 0 00-6-6zm27-41a6 6 0 00-6 6v110a6 6 0 0012 0V73a6 6 0 00-6-6zm-54 67a6 6 0 00-6 6v30a6 6 0 0012 0v-30a6 6 0 00-6-6zm81-79a6 6 0 00-6 6v81a6 6 0 0012 0V61a6 6 0 00-6-6zm27 26a6 6 0 00-6 6v30a6 6 0 0012 0V87a6 6 0 00-6-6z"
        fill="url(#newmall-logo-gradient-001) #FBCE31"
      />
    </svg>
  )
}

module.exports = NewMallLogo
