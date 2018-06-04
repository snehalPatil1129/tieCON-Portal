export default {
  items: [{
      name: 'Dashboard',
      url: '/dashboard',
      icon: 'icon-speedometer',
      forAll : true
    },
    {
      name: 'Session',
      url: '/session',
      icon: 'icon-microphone',
      forAll : false
    },
    {
      name: 'Rooms',
      url: '/rooms',
      icon: 'icon-home',
      forAll : false
    },
    {
      name: 'Events',
      url: '/events',
      icon: 'icon-home',
      forAll : false
    },
     {
      name: 'Attendance',
      url: '/attendance',
      icon: 'icon-note',
      forAll : true
    },
    {
      name: 'Attendee',
      url: '/attendee',
      icon: 'icon-note',
      forAll : false
    },
    {
      name: 'Speakers',
      url: '/speakers',
      icon: 'icon-microphone',
      forAll : false
    },
    {
      name: 'Initial Questions',
      url: '/initialQuestions',
      icon: 'icon-note',
      forAll : false
    },
    {
      name: 'Sponsor',
      url: '/sponsor',
      icon: 'icon-note',
      forAll : false
    },
    {
      name: 'About Us',
      url: '/aboutUs',
      icon: 'icon-note',
      forAll : false
    },  
    {
      name: 'Session Registration',
      url: '/sessionRegistration',
      icon: 'icon-note',
      forAll : false
    },      
    {
      title: true,
      name: 'Reports',
      wrapper: {
        element: '',
        attributes: {}
      },
      forAll : true
    },
    {
      name: 'Attendee Report',
      url: '/attendeeReport',
      icon: 'icon-pie-chart',
      forAll : true
    },
    {
      name: 'Session Report',
      url: '/sessionReport',
      icon: 'icon-pie-chart',
      forAll : true
    },
    {
      name: 'Live Sessions Report',
      url: '/sessionsReport',
      icon: 'icon-pie-chart',
      forAll : true
    },
    {
      title: true,
      name: 'Users',
      wrapper: {
        element: '',
        attributes: {}
      },
      forAll : false
    },
   
    {
      name: 'Role',
      url: '/role',
      icon: 'icon-trophy',
      forAll : false
    },
    {
      name: 'Logout',
      url: '/logOut',
      icon: 'icon-lock',
      forAll : true
    },
  ]
};