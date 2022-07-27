import { alphabetUp } from '@helpers/value';
import { toFixedNumber } from '@helpers/currency';

export const calculate = (props) => {
    const { nodes, allCategories, allGaps, position = '', title, normalize: _sort_normalize } = props
    const normalise_data = [];
    const headers = [
        {
            label: "No.",
            value: 'ID',

        },
        {
            label: "Name",
            value: 'name',
            
        }
    ];

    //console.log(props)

    const category_headers = [];
    const sub_category_headers = [];
    let allCriteria = [];
    const sub_criteria_kodes = {};

    if (allCategories.length) {
        let n = 0;
        allCategories.forEach(item => {
            let subCriteria = item.subCriteria.nodes;
            /*
            allCriteria = [
                ...allCriteria,
                ...subCriteria
            ]
            */
            
            let childs = [];
            category_headers.push({
                id: item.id,
                label: item.title,
                count: subCriteria.length,
                percentage: item.percentage
            })

            let kode = alphabetUp[n++];
            if (subCriteria.length) {
                let ii = 1;
                subCriteria.forEach(({...sub}) => {
                    if (sub.position === position || (sub.position != null &&  sub.position.includes(position))) {
                        sub.kode = kode + (ii++)
                        sub_category_headers.push(sub) 
                        sub_criteria_kodes[sub.id] = sub.kode;

                        childs.push(sub)
                    }
                })
            }

            allCriteria = [
                ...allCriteria,
                ...childs
            ]

        });
    }

    let items = [];
    if (nodes.length) { 
        items = nodes.map(item => {
            let row = {};
            let scores = item?.scores?.nodes;
            let manipulted_value = {};
            /*
            if (scores.length <= 0 && sub_category_headers.length > 0) {
                manipulted_value = sub_category_headers.map(m => {
                    return [m.id] = 0;
                })
            }
            else if (scores.length <= 0 && sub_category_headers.length <= 0) {
                manipulted_value = [];
            }
            else {
                let { value: _values } = scores[0];
                manipulted_value = _values;
            }

            */
            if (scores.length <= 0) {
                manipulted_value = [];
            }
            else {
                let { value: _values } = scores[0];
                manipulted_value = _values;
            }
            let value = manipulted_value;
            
            row.name = item.name;
            row.ID = item.backNumber;
            row.values = value;

            let dataItem = {
                node_Id: item._nodeId,
                id: item.backNumber,
                playerId: item.id,
                name: item.name
            }

            
            let NSF_data = [];
            let NCF_data = [];
            let points = {};
            let NCF_OBJECT = {};
            let NSF_OBJECT = {};
            if (allCriteria.length) {
                allCriteria.forEach(criteria => {

                    if (!dataItem[`ncf_${criteria.parentId}`]) {
                        dataItem[`ncf_${criteria.parentId}`] = 0;
                    }

                    if (!NCF_OBJECT[criteria.parentId]) {
                        NCF_OBJECT[criteria.parentId] = [];
                    }

                    if (!NSF_OBJECT[criteria.parentId]) {
                        NSF_OBJECT[criteria.parentId] = [];
                    }
                      
                    if (!dataItem[`nsf_${criteria.parentId}`]) {
                        dataItem[`nsf_${criteria.parentId}`] = 0;
                    }

                    if (value[criteria.id]) {
                        dataItem[sub_criteria_kodes[criteria.id]] = value[criteria.id];
                        dataItem[`gap_${criteria.id}`] = Number(value[criteria.id]) - Number(criteria.idealValue)
                    }
                    else {
                        dataItem[sub_criteria_kodes[criteria.id]] = 0;
                        dataItem[`gap_${criteria.id}`]  = 0 - Number(criteria.idealValue)
                    }  

                    const test = [];
                    
                    if (allGaps.length) {
                        allGaps.forEach(gap => {
                            if (Number(gap['gap']) === dataItem[`gap_${criteria.id}`]) {
                                dataItem[`integrity_${criteria.id}`] = gap['integrity'];
                                if (criteria.type === 'CORE') {
                                    NCF_data.push(dataItem[`integrity_${criteria.id}`])
                                    NCF_OBJECT[criteria.parentId].push(gap['integrity'])
                                }
                                else if (criteria.type === 'SECONDARY') {
                                    NSF_data.push(dataItem[`integrity_${criteria.id}`])
                                    NSF_OBJECT[criteria.parentId].push(gap['integrity'])
                                }
                            }
                        })
                    }

                    //calculate NSF and NCF 
                    if (criteria.type === 'CORE') {
                        //dataItem[`ncf_${criteria.parentId}`] = (NCF_data.length) ? NCF_data.reduce((a, b) => a + b, 0) / NCF_data.length : 0;
                        //dataItem[`ncf_${criteria.parentId}`] = toFixedNumber(dataItem[`ncf_${criteria.parentId}`], 2);

                        let totNCF = (NCF_OBJECT[criteria.parentId].length) ? NCF_OBJECT[criteria.parentId].reduce((a, b) => a + b, 0) / NCF_OBJECT[criteria.parentId].length : 0;
                        dataItem[`ncf_${criteria.parentId}`] = toFixedNumber(totNCF, 2);
                    }
                    else if (criteria.type === 'SECONDARY') {
                        //dataItem[`nsf_${criteria.parentId}`] = (NSF_data.length) ? NSF_data.reduce((a, b) => a + b, 0) / NSF_data.length : 0;
                        //dataItem[`nsf_${criteria.parentId}`] = toFixedNumber(dataItem[`nsf_${criteria.parentId}`], 2);

                        let totNSF  = (NSF_OBJECT[criteria.parentId].length) ? NSF_OBJECT[criteria.parentId].reduce((a, b) => a + b, 0) / NSF_OBJECT[criteria.parentId].length : 0;
                        dataItem[`nsf_${criteria.parentId}`] = toFixedNumber(totNSF, 2);
                    }

                    if (`ncf_${criteria.parentId}` === 'ncf_5') {
                        console.log([
                            criteria.name,
                            NCF_data,
                            NCF_OBJECT[`ncf_${criteria.parentId}`]
                        ])
                    }

                    //if (dataItem[`ncf_${criteria.parentId}`] > 0 && dataItem[`nsf_${criteria.parentId}`] > 0) {
                        let nTotal = (dataItem[`ncf_${criteria.parentId}`] * 0.6) + (dataItem[`nsf_${criteria.parentId}`] * 0.4);
                        dataItem[`nTotal_${criteria.parentId}`] = nTotal;
                        if (nTotal > 0) {
                            let parent = category_headers.find(c => c.id === criteria.parentId);
                            let point = dataItem[`nTotal_${criteria.parentId}`] * (parent.percentage / 100); 
                            dataItem[`nPoint_${criteria.parentId}`] = point;
                            // points.push(dataItem[`nPoint_${criteria.parentId}`]);
                            points[criteria.parentId] = dataItem[`nPoint_${criteria.parentId}`];
                        }
                    //}

                    
                })
            }

            dataItem['points'] = Object.values(points);
            dataItem[`total_point`] = (Object.values(points).length) ? Object.values(points).reduce((a, b) => a + b, 0) : 0;
            dataItem[`total_point`] = toFixedNumber(dataItem[`total_point`], 2);
            normalise_data.push(dataItem);
            return row;
        })

        
    }

    let sort_normalize = (normalise_data.length) ? normalise_data.sort(function (x, y) {
        return y.total_point - x.total_point;
    }) : []; 

    return {
        normalise_data,
        sort_normalize,
        items,
        allCriteria,
        sub_criteria_kodes,
        sub_criteria_kodes,
        sub_category_headers,
        allCategories,
        title: position,
        headers
    }
}