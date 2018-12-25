let bus = new Vue();

Vue.component('equipment-component', {
    template: '#equipmentComponent',
    props: ['equipmentData', 'currentEquipments', 'proc'],
    created: function() {
        bus.$on('es', function(event) {
            let setName = event.target.innerText.trim();

            let information = null;
            for (let e in vm.sets) {
                if (e === setName) {
                    information = vm.sets[e]
                    break;
                }
            }

            let currentEQ = vm._data.equipments[getProc()];
            for (let e in currentEQ) {
                // console.log(currentEQ[e].partsName)
                for (let ee in information) {
                    if (currentEQ[e].partsName === information[ee].parts) {
                        currentEQ[e].ab = information[ee].ab;
                        currentEQ[e].set = setName;
                        currentEQ[e].name = information[ee].name;
                    }
                }
            }
        })
    }
});

Vue.component('calc-proc-component', {
    template: '#calcProcComponent',
    props: ['proc', 'buff']
});

let vm = new Vue({
    el: '#app',
    data: {
        setSelector: false,
        model: {},
        equipments: {
            영축: [],
            용축: [],
            아포: [],
            크오빅: []
        },
        sets: {
            refresh: ''
        },
        proc: [{
            name: '영축',
            stat: null,
            check: true
        }, {
            name: '용축',
            stat: null,
            check: false
        }, {
            name: '아포',
            stat: null,
            check: false
        }, {
            name: '크오빅',
            stat: null,
            check: false
        }],
        buff: {
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
            ability: [],
            result: {
                힘: 0,
                지능: 0,
                물공: 0,
                마공: 0,
                독공: 0
            },
            applyStat: 0,
            noDivineStat: 0,
            noDivine: {
                힘: 0,
                지능: 0,
                물공: 0,
                마공: 0,
                독공: 0
            },
            area: 0,
            calc: function() {
                this.result = {
                    힘: 0,
                    지능: 0,
                    물공: 0,
                    마공: 0,
                    독공: 0
                };
                this.noDivine = {
                    힘: 0,
                    지능: 0,
                    물공: 0,
                    마공: 0,
                    독공: 0
                };
                this.ability = [];
                this.level = 0;
                this.applyStat = 0;
                this.noDivineStat = 0;
                this.area = 125;

                this.name = getProc();
                let mapSkill = {};
                for (let e in vm.model.skill) {
                    mapSkill[vm.model.skill[e].name] = e;
                }

                let eq = vm.equipments[this.name]; // 현재 입고있는 장비
                let setInfo = vm.model.set; // 모든 세트 정보
                let setArray = {}; // 몇 세트 입고있는지

                // setArray(객체)에 세트별로 몇 세트 입고있는지 저장
                for (let e in eq) {
                    let _setName = eq[e].set;
                    if (_setName) {
                        if (!setArray[_setName]) setArray[_setName] = 0;
                        setArray[_setName]++;
                    }
                }

                // this.ability(배열)에 ability push (세트)
                for (let e in setInfo) {
                    let _setName = setInfo[e].name;
                    if (setArray[_setName]) { // 장착중인 장비 중 세트 있는지 확인
                        let _ab = setInfo[e].ab;
                        for (let ee in _ab) {
                            if (_ab[ee].number <= setArray[_setName]) {
                                for (let eee in _ab[ee].option) {
                                    this.ability.push(_ab[ee].option[eee]);
                                }
                            }
                        }
                    }
                }

                // this.ability(배열)에 ability push (장비)
                for (let e in eq) {
                    for (let ee in eq[e].ab) {
                        this.ability.push(eq[e].ab[ee]);
                    }
                }

                // 레벨 초기화
                this.level = vm.model.skill[mapSkill[this.name]].startlevel;

                // 레벨 초기화 - 패시브 레벨 초기화
                let passiveLevel = {};
                switch (this.name) {
                    case "영축":
                    case "아포":
                        passiveLevel = {
                            보징: 0,
                            신념: 0,
                            디바인: 0
                        };
                        break;
                    default:
                        passiveLevel = {
                            열정: 0
                        };
                        break;
                };
                let _skill = vm.model.skill;
                for (let e in _skill) {
                    let _skillName = _skill[e].name;
                    if (passiveLevel[_skillName] !== undefined) {
                        passiveLevel[_skillName] = _skill[e].startlevel;
                    }
                }

                // 레벨 증가, 아리아 증폭
                for (let e in this.ability) {
                    let _parse = getAB(this.ability[e]);
                    if (_parse.firstKey === "스탯") continue;
                    if (_parse.firstKey === "아리아") {
                        if (_parse.secondKey === "증폭") {
                            this.area += _parse.val;
                        }
                        continue;
                    }
                    if (_parse.secondKey !== "레벨") continue;
                    if (passiveLevel[_parse.firstKey]) passiveLevel[_parse.firstKey] += _parse.val;
                    if (_parse.firstKey === this.name) this.level += _parse.val;
                }

                let plusStat = {};
                let multiStat = {};
                for (let e in passiveLevel) {
                    plusStat[e] = 0;
                    multiStat[e] = 0;
                }

                for (let e in this.ability) {
                    let _ab = getAB(this.ability[e]);
                    if (plusStat[_ab.firstKey] !== undefined && _ab.secondKey !== "레벨") {
                        if (_ab.isP) multiStat[_ab.firstKey] += _ab.val;
                        else plusStat[_ab.firstKey] += _ab.val;
                    }
                }

                // 스킬로 인한 스탯 증가치 plusStat에 더해주기
                // console.log(plusStat);
                for (let e in plusStat) {
                    let _sLevel = _skill[mapSkill[e]].startlevel;
                    let _sAb = _skill[mapSkill[e]].ab;
                    if (_sAb.length + _sLevel - 1 < passiveLevel[e]) {
                        passiveLevel[e] = _sAb.length + _sLevel - 1;
                    }

                    plusStat[e] += _sAb[passiveLevel[e] - _sLevel].주스탯;
                }

                //
                for (let e in multiStat) {
                    plusStat[e] *= (multiStat[e] + 100) / 100;
                }

                for (let e in vm.proc) {
                    if (vm.proc[e].name === this.name) {
                        this.stat = vm.proc[e].stat;
                    }
                }

                this.applyStat = this.stat;

                for (let e in plusStat) {
                    this.applyStat += plusStat[e];
                }

                let _map = {
                    영축: "체정",
                    아포: "체정",
                    용축: "지능",
                    크오빅: "지능"
                }

                let applyMultiStat = 100;
                for (let e in this.ability) {
                    let _ab = getAB(this.ability[e]);
                    if (_ab.firstKey === "스탯" && _ab.secondKey === _map[this.name]) {
                        if (_ab.isP) {
                            applyMultiStat += _ab.val;
                        } else {
                            this.applyStat += _ab.val;
                        }
                    }
                }
                if (plusStat['디바인']) {
                    this.noDivineStat = this.applyStat - plusStat['디바인'];
                } else {
                    this.noDivineStat = 0;
                }
                this.applyStat *= applyMultiStat / 100;
                this.noDivineStat *= applyMultiStat / 100;
                // console.log(this.noDivineStat);

                // 스탯은 다 구함

                let skillAb = vm.model.skill[mapSkill[this.name]].ab;
                let _startlevel = vm.model.skill[mapSkill[this.name]].startlevel;
                if (this.level > skillAb.length + _startlevel - 1) {
                    this.level = skillAb.length + _startlevel - 1;
                }

                let _ability = skillAb[this.level - _startlevel];

                for (let e in _ability) {
                    if (e === "물마독") {
                        this.result["물공"] = _ability[e];
                        this.result["마공"] = _ability[e];
                        this.result["독공"] = _ability[e];
                    }
                    if (e === "힘지") {
                        this.result["힘"] = _ability[e];
                        this.result["지능"] = _ability[e];
                    }
                }

                // 이제 this.ability에서 getAB 통해서 this.result의 것들 값 더해준 뒤 곱해주기
                let _percent = {
                    힘: 100,
                    지능: 100,
                    물공: 100,
                    마공: 100,
                    독공: 100
                };

                for (let e in this.ability) {
                    let _ab = getAB(this.ability[e]);
                    if (_ab.firstKey === this.name && _ab.secondKey !== "레벨") {
                        if (_ab.isP) {
                            if (_ab.secondKey === "힘지") {
                                _percent.힘 += _ab.val;
                                _percent.지능 += _ab.val;
                            } else if (_ab.secondKey === "물마공") {
                                _percent.물공 += _ab.val;
                                _percent.마공 += _ab.val;
                            } else if (_ab.secondKey === "물마독") {
                                _percent.물공 += _ab.val;
                                _percent.마공 += _ab.val;
                                _percent.독공 += _ab.val;
                            } else {
                                _percent[_ab.secondKey] += _ab.val;
                            }
                        } else {
                            if (_ab.secondKey === "힘지") {
                                this.result.힘 += _ab.val;
                                this.result.지능 += _ab.val;
                            } else if (_ab.secondKey === "물마공") {
                                this.result.물공 += _ab.val;
                                this.result.마공 += _ab.val;
                            } else if (_ab.secondKey === "물마독") {
                                this.result.물공 += _ab.val;
                                this.result.마공 += _ab.val;
                                this.result.독공 += _ab.val;
                            } else {
                                this.result[_ab.secondKey] += _ab.val;
                            }
                        }
                    }
                }

                for (let e in _percent) {
                    this.result[e] *= _percent[e] / 100;
                    this.noDivine[e] = this.result[e];
                }

                for (let e in this.result) {
                    this.result[e] = Math.round(this.result[e] * (1 + this.applyStat / this.factor()));
                    this.noDivine[e] = Math.round(this.noDivine[e] * (1 + this.noDivineStat / this.factor()));
                }

                this.applyStat = Math.round(this.applyStat);

                //End of function
            }
        }
    },
    watch: {
        model: function() {
            let _eq = this.model.equipment;
            for (let e in _eq) {
                for (let ee in _eq[e]) {
                    let setName = _eq[e][ee].set;
                    if (setName) {
                        if (!this.sets[setName]) {
                            this.sets[setName] = [];
                        }
                        // console.log(_eq[e][ee]);
                        this.sets[setName].push({
                            name: _eq[e][ee].name,
                            parts: e,
                            ab: _eq[e][ee].ab ? _eq[e][ee].ab : []
                        });
                    }
                }
            }
            this.sets.refresh = ' ';
            this.sets.refresh = '';
        }
    },
    components: {
        'set-component': {
            template: '#setComponent',
            props: ['eq', 'sets'],
            methods: {
                equipSet: function(event) {
                    bus.$emit('es', event);
                    /*
                    html 태그에 @input="equipSet(event)",
                    이벤트를 받을 컴포넌트에
                    bus.$on('es', function(event) {})
                    그리고 여기에 bus.$emit('es', event)
                    이렇게 했는데 크롬과 IE 모두 정상작동 되는 것처럼 보인다.
                    하지만 이게 맞는 방식인지 아닌지 잘 모르고 한 것.
                    따라서 검토 바람.
                    */
                }
            }
        }
    }
})

dbRead('/shield', function(data) {
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

function getProc() { //영축, 용축, 아포, 크오빅 중 하나 반환
    let _proc = vm.proc;
    for (let e in _proc) {
        if (_proc[e].check) {
            return _proc[e].name;
        }
    }
}

function getAB(STR) {
    let keyword = STR.split(/ +/);

    return {
        firstKey: keyword[0],
        secondKey: keyword[1],
        val: Number(/[0-9]*/.exec(keyword[2])[0]),
        isP: /%/.test(keyword[2])
    };
}