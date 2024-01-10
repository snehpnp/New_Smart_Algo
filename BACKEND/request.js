module.exports = function (app) {


  const { DashboardView } = require('./View/DashboardData')
  
 


  app.get('/dashboard-view', async (req, res) => {
    DashboardView()
    res.send({ msg: "Done!!!" })
  })

}


