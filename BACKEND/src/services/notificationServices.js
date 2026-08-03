const {
sendNotification
}
=
require("../socket/socket");



exports.checkBudgetAlert = (
userId,
category,
spent,
budget
)=>{


const percentage =
(spent / budget) * 100;



if(percentage >= 90){


sendNotification(

userId,

`⚠ ${percentage.toFixed(0)}% of ${category} budget used`

);


}


};