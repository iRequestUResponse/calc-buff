Vue.component('equipment-component', {
    template: '#equipmentComponent',
    props: ['equipmentData', 'currentEquipments']
});

let vm = new Vue({
    el: '#app',
    data: {
        model: {},
        equipments: [],
        cheat: ''
    }
})

dbRead('/shield').then(function(data) {
    vm._data.model = data.val();
    for (let e in vm._data.model.equipment) {
        vm._data.equipments.push({
            partsName: e,
            name: '',
            ab: [],
            set: null,
            show: false
        });
    }
});

function closeAll() {
    for (let e in vm._data.equipments) {
        vm._data.equipments[e].show = false;
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
    equipments: [], // 이 속성 없애자
    ability: {
        statPlus: [],
        statPercent: [],
        skillLevel: [],
        skillPlus: [],
        skillPercent: []
    },
    getAbility: function() {
        let eq = vm._data.equipments;
        // let eq = vm._data.model.equipment;
        for (let e in eq) {
            // for (let ee in eq[e]) {
            //     console.log(eq[e][ee].set);
            // }
        }
    },
    getSkill: function() {

    },
    getStat: function() {
        let stat = Number(this.stat);
        let statPercent = 1;

        for (let e in this.equipments) {
            if (e.ab) {
                let _ab = getAB(e.ab);

                if (_ab.skillName === "스탯") {
                    let map0 = {
                        영축: "체정",
                        용축: "지능",
                        아포: "체정",
                        크오빅: "지능"
                    }

                    if (_ab.statName === map0[this.name]) {
                        if (_ab.isP) {
                            statPercent += _ab.val;
                        } else {
                            stat += _ab.val;
                        }
                    }
                } else {
                    let map1 = {

                    }
                }
            }
        }
        // 스킬 레벨 올리기
        // 스킬 주스탯 올리기
        // 주스탯 올리기
        // 원래 주스탯에 스킬 주스탯 올리기
        // 원래 주스탯에 장비 주스탯 올리기
        // 원래 주스탯에 장비 주스탯 곱하기
    }
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