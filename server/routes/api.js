const express = require('express')
const router = express.Router()
const moment = require('moment')
const Expense = require('../model/Expense')
// const fs = require('fs');
// const file = fs.readFileSync('./expenses.json', 'utf8')
// let jsonObject = JSON.parse(file);
// jsonObject.forEach(element => {
//     data = new Expense(element)
//     console.log(data)
//      data.save()
// });

// router.get('/expenses', function (req, res) {
//     Expense.find({}).sort({
//         date: 1//s8er ll kber // date: -1 lkber ll s8er
//     }).then(function (expenses) {
//         res.send(expenses)
//     })
// })
router.post('/expense', function (req, res) {
    const item = req.body.item
    const amount = req.body.amount
    const group = req.body.group
    const newExpense = new Expense({ item: item, amount: amount, group: group, date: moment().format() })

    newExpense.save().then((exp) => {
        console.log(`the amount ${exp.amount} you spent on your group ${exp.group}`);
        res.send(newExpense)
    });

})

router.put('/update/:group1/:group2', function (req, res) {
    const group1 = req.params.group1
    const group2 = req.params.group2
    console.log(group1, group2)
    Expense.find({ group: group1 }).limit(1).then(function (expense) {
        const was = expense[0].group
        expense[0].group = group2
        res.send(`this name item ${expense[0].item}, thats changed group from ${was} to ${expense[0].group}`)
        expense[0].save()
    })
})

router.get('/expenses/:group', function (req, res) {
    const group = req.params.group
    const total = req.query.total
    
    if (total == "true") {
        Expense.aggregate([
            {
                $match: { group: group }
            },
            {
                $group:
                {
                    _id: { group: "$group", item:"$item" },
                    totalamount: { $sum: "$amount" },
                    countamount: { $sum: 1 }
                }
            }
        ]).then(results => {
            res.send(results)
        })
    } else {
        Expense.find({ group: group }).then(function (expenses) {
            res.send(expenses)
        })
    }
})

router.get('/expenses', function (req, res) {
    const d1 = req.query.d1
    const d2 = req.query.d2 || moment().format()
    if (!d1 && d2) {
        Expense.find({}).sort({
            date: 1//s8er ll kber // date: -1 lkber ll s8er
        }).then(function (expenses) {
            res.send(expenses)
        })
    } else {
        Expense.find({
            $and: [{
                date: { $gte: d1, $lte: d2 }
            }]
        }).then(result => {

            res.send(result)
        })
    }
})

module.exports = router