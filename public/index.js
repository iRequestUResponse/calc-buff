Vue.component('equipment-component', {
    template: '#equipmentComponent',
    props: ['equipmentData', 'currentEquipments', 'proc']
});

Vue.component('calc-proc-component', {
    template: '#calcProcComponent',
    props: ['proc']
});

function getProc(_proc) {
    for (let e in _proc) {
        if (_proc[e].check) {
            return _proc[e].name;
        }
    }
}

let vm = new Vue({
    el: '#app',
    data: {
        model: {},
        equipments: {
            영축: [],
            용축: [],
            아포: [],
            크오빅: []
        },
        proc: [{
            name: '영축',
            stat: 0,
            check: true
        }, {
            name: '용축',
            stat: 0,
            check: false
        }, {
            name: '아포',
            stat: 0,
            check: false
        }, {
            name: '크오빅',
            stat: 0,
            check: false
        }]
    }
})

dbRead('/shield').then(function(data) {
    vm._data.model = data.val();
    for (let e in vm._data.model.equipment) {
        for (let ee in vm._data.equipments) {
            vm._data.equipments[ee].push({
                partsName: e,
                name: '',
                ab: [],
                set: null,
                show: false
            });
        }
    }
});

function closeAll() {
    for (let e in vm._data.equipments) {
        for (let ee in vm._data.equipments[e])
            vm._data.equipments[e][ee].show = false;
    }
}

let buff = {
    stat: 0,
    name: "",
    level: 0,
    factor: function() {
        let map = {
            영축: 630,
            용축: 700,
            아포: 750,
            크오빅: 830
        }

        return map[this.name];
    },
    ability: {
        statPlus: {
            힘: 0,
            지능: 0,
            물공: 0,
            마공: 0,
            독공: 0
        },
        statPercent: {
            힘: 0,
            지능: 0,
            물공: 0,
            마공: 0,
            독공: 0
        },
        skillLevel: 0,
        skillPlus: 0,
        skillPercent: 0
    },
    getAbility: function() {
        this.ability = {
            statPlus: {
                힘: 0,
                지능: 0,
                물공: 0,
                마공: 0,
                독공: 0
            },
            statPercent: {
                힘: 0,
                지능: 0,
                물공: 0,
                마공: 0,
                독공: 0
            },
            skillLevel: 0,
            skillPlus: 0,
            skillPercent: 0
        };
        let eq = vm._data.equipments;
        let _proc = getProc(vm.proc);

        for (let e in eq[_proc]) {
            let abArray = eq[_proc][e].ab;

            for (let ee in abArray) {
                this.abToTruth(abArray[ee], _proc);
                // console.log(abArray[ee], typeof abArray[ee]);
            }
        }
    },
    abToTruth: function(_string, _proc_) {
        let _ab = getAB(_string);
        if (_ab.skillName === "스탯") {

        } else if (_ab.skillName === _proc_) {

            // _ab.statName
            // _ab.val
            // _ab.isP
        }
    },
    // getSkill: function() {

    // },
    // getStat: function() {
    //     let stat = Number(this.stat);
    //     let statPercent = 1;

    //     for (let e in this.equipments) {
    //         if (e.ab) {
    //             let _ab = getAB(e.ab);

    //             if (_ab.skillName === "스탯") {
    //                 let map0 = {
    //                     영축: "체정",
    //                     용축: "지능",
    //                     아포: "체정",
    //                     크오빅: "지능"
    //                 }

    //                 if (_ab.statName === map0[this.name]) {
    //                     if (_ab.isP) {
    //                         statPercent += _ab.val;
    //                     } else {
    //                         stat += _ab.val;
    //                     }
    //                 }
    //             } else {
    //                 let map1 = {

    //                 }
    //             }
    //         }
    //     }
    //     // 스킬 레벨 올리기
    //     // 스킬 주스탯 올리기
    //     // 주스탯 올리기
    //     // 원래 주스탯에 스킬 주스탯 올리기
    //     // 원래 주스탯에 장비 주스탯 올리기
    //     // 원래 주스탯에 장비 주스탯 곱하기
    // }
};

function getAB(STR) {
    let keyword = STR.split(/ +/);

    return {
        skillName: keyword[0],
        statName: keyword[1],
        val: /[0-9]*/.exec(keyword[2])[0],
        isP: /%/.test(keyword[2])
    };
}