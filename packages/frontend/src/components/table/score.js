import React, { useEffect, useState } from 'react';
import useDeepCompareEffect from 'use-deep-compare-effect'
import classNames from "classnames";
import { alphabetUp } from '@helpers/value';
import { toFixedNumber } from '@helpers/currency';
import { positions } from '@helpers/position';
import { useMutation } from '@apollo/client';
import { ADD_RATING } from '@gql/rating';
import { getWeek } from '@helpers/date';
export function TableItem(props) {
    const { nodes, allCategories, allGaps, position = '', title, normalize : _sort_normalize} = props
    const [open, setOpen] = useState(false);
    const [done, setDone] = useState(false);
    const [saved, setReadyObj] = useState(false);
    const setReady = updated => setReadyObj(updated);
    // const handleToggle = useCallback(() => setOpen((open) => !open), []);
    // if (nodes.length <= 0) return (<></>);
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

            // console.log('sub_category_headers', sub_category_headers)
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
                name: item.name
            }

            
            let NSF_data = [];
            let NCF_data = [];
            let points = {};
            if (allCriteria.length) {
                allCriteria.forEach(criteria => {

                    if (!dataItem[`ncf_${criteria.parentId}`]) {
                        dataItem[`ncf_${criteria.parentId}`] = 0;
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

                    
                    if (allGaps.length) {
                        allGaps.forEach(gap => {
                            if (Number(gap['gap']) === dataItem[`gap_${criteria.id}`]) {
                                dataItem[`integrity_${criteria.id}`] = gap['integrity'];
                                if (criteria.type === 'CORE') {
                                    NCF_data.push(dataItem[`integrity_${criteria.id}`])
                                }
                                else if (criteria.type === 'SECONDARY') {
                                    NSF_data.push(dataItem[`integrity_${criteria.id}`])
                                }
                            }
                        })
                    }

                    //calculate NSF and NCF 
                    if (criteria.type === 'CORE') {
                        dataItem[`ncf_${criteria.parentId}`] = (NCF_data.length) ? NCF_data.reduce((a, b) => a + b, 0) / NCF_data.length : 0;
                        dataItem[`ncf_${criteria.parentId}`] = toFixedNumber(dataItem[`ncf_${criteria.parentId}`], 2);
                    }
                    else if (criteria.type === 'SECONDARY') {
                        dataItem[`nsf_${criteria.parentId}`] = (NSF_data.length) ? NSF_data.reduce((a, b) => a + b, 0) / NSF_data.length : 0;
                        dataItem[`nsf_${criteria.parentId}`] = toFixedNumber(dataItem[`nsf_${criteria.parentId}`], 2);
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

    //WyJwbGF5ZXJzIiwxXQ==
    //WyJwbGF5ZXJzIiwzXQ==

    let sort_normalize = (normalise_data.length) ? normalise_data.sort(function (x, y) {
        return y.total_point - x.total_point;
    }) : []; 

    const effectDependency = sort_normalize;

    const Collapsible = (props) => {
        const { open, children } = props
        return (
            <div className={classNames("collapsible",
                open ? "show" : "hide",
              )}
            >
            {children}
            </div>
        )
    }

    const handleToggle = () => setOpen((open) => !open)

    useEffect(() => {
        console.log('READY TO GO...')
        if (sort_normalize.length > 0 && !saved) {
            let highScore = sort_normalize.find(element => element !== undefined);

            if (highScore?.total_point && highScore.total_point > 0) {
                setReady(highScore);

                if (!done) {
                    const today = new Date();
                    let variables = {}
                    variables.createdAt = today;
                    variables.result = {
                        point: saved.total_point,
                        playerName: saved.name,
                        playerID: saved.id,
                        node_Id: saved.node_Id,
                    }
                    variables.week = getWeek();
                    variables.year = today.getFullYear();
                    variables.position = position;
                    //addRating({ variables });
                    //console.log(variables)
                    console.log('SAVING NOW', variables)
                }
            
            }
        }
    }, []); 

    const [addRating, { loading }] = useMutation(ADD_RATING, {
		onCompleted: (data) => {
            setDone(true);
		}
	});

    const Progress = () => {
        return (
            <div className="m-0">
                <div className="row gap-y-6 mt-5 pt-2">
                    <div className="col-12 col-lg-12">
                        <svg width="25" viewBox="-2 -2 42 42" xmlns="http://www.w3.org/2000/svg" stroke="white" className="w-4 h-4 ms-2">
                            <g fill="none" fillRule="evenodd">
                                <g transform="translate(1 1)" strokeWidth="4">
                                    <circle strokeOpacity=".5" cx="18" cy="18" r="18"></circle>
                                    <path d="M36 18c0-9.94-8.06-18-18-18">
                                        <animateTransform attributeName="transform" type="rotate" from="0 18 18" to="360 18 18" dur="1s" repeatCount="indefinite"></animateTransform>
                                    </path>
                                </g>
                            </g>
                        </svg>
                    </div>
                </div>
            </div>
        )
    }

    return (
        
        <div className="box m-3">
            {(loading) ? (<Progress/>): (null)}
            <div className="row gap-y-6 mt-5 pt-2">
                <div className="col-12 col-lg-6">
                    <div className="flex flex-col sm:flex-row items-center p-5 border-b border-gray-200">
                        <h1 className="font-medium text-base mr-auto">
                            Score for <span className='font-extrabold'>{title}</span>
                        </h1>
                        
                        <div className="w-full sm:w-auto flex items-center sm:ml-auto mt-3 sm:mt-0">
                            <button onClick={handleToggle}
                                open={false}
                                aria-controls="basic-collapsible" type="button" className="btn btn-outline-secondary w-full d-inline-block me-1 mb-2">
                                {(open) ? 'Close detail' : 'Open detail'} <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={`feather ${(open) ? 'feather-chevron-up': 'feather-chevron-down'}`}><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-6" style={{display: 'none'}}>
                    <div className="p-5">
                        <table className="table">
                            <thead>
                                <tr className="bg-gray-200 dark:bg-dark-1">
                                    <td className="border border-b-2 dark:border-dark-5 whitespace-nowrap">Kode</td>
                                    <td className="border border-b-2 dark:border-dark-5 whitespace-nowrap">Criteria</td>
                                </tr>
                            </thead>
                            <tbody>  
                                {sub_category_headers.map(value => {
                                    return (
                                        <tr key={ value.id} className="bg-gray-200 dark:bg-dark-1">
                                            <td className="border border-b-2 dark:border-dark-5 whitespace-nowrap">{ value.kode.toUpperCase() }</td>
                                            <td className="border border-b-2 dark:border-dark-5 whitespace-nowrap">{ value.name }</td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <Collapsible
                    open={open}
                    id="basic-collapsible"
                    transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
                    expandOnPrint
                >
                <div className="col-12 col-lg-6">
                    <div className="p-5">
                        <table className="table">
                            <thead>
                                <tr>
                                    {headers.map(value => {
                                        return (
                                            <th key={ value.id} className="border border-b-2 dark:border-dark-5 whitespace-nowrap">{value.label}</th>
                                        )
                                    })}

                                    {sub_category_headers.map(sub => {
                                        let core = (sub.type === 'CORE') ? 'font-extrabold' : '';
                                        return (
                                            <th key={ sub.id} className={`border border-b-2 dark:border-dark-5 whitespace-nowrap`}><span className={`${core}`}>{ sub.kode.toUpperCase()}</span></th>
                                        )
                                    })}
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {items.map(values => {
                                    return (
                                        <tr className="bg-white">
                                            {
                                                headers.map(value => {
                                                    return (
                                                        <td key={ value.id} className="border border-b-2  whitespace-nowrap">{values[`${value.value}`]}</td>
                                                    )
                                                })   
                                            }

                                            {
                                                sub_category_headers.map(sub => {
                                                    let val = 0;
                                                    for (const key in values.values) {
                                                        if (sub.id === Number(key)) {
                                                            val = values.values[key];
                                                        }
                                                    }

                                                    return (
                                                        <td  key={ sub.id} className="border border-b-2  whitespace-nowrap">{ val }</td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })}

                                <tr className="bg-gray-200 dark:bg-dark-1">
                                    <td colSpan={2} className="border border-b-2 dark:border-dark-5 whitespace-nowrap"><span className='font-extrabold'>{'Target'}</span></td>
                                    {
                                        allCriteria.map(criteria => {
                                            return (
                                                <td  key={ criteria.id} className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>{ criteria.idealValue }</span></td>
                                            )
                                        })
                                    }
                                </tr>

                                {normalise_data.map(item => {
                                    return (
                                        <tr className="bg-white">
                                           <td className="border border-b-2  whitespace-nowrap">{ item.id }</td>
                                           <td className="border border-b-2  whitespace-nowrap">{ item.name }</td>
                                            {
                                                sub_category_headers.map(sub => {
                                                    return (
                                                        <td  key={ sub.id} className="border border-b-2  whitespace-nowrap">{ item[`gap_${sub.id}`] }</td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })}

                                <tr className="bg-gray-200 dark:bg-dark-1">
                                    <td align="center" colSpan={sub_category_headers.length + 2} className="border border-b-2 dark:border-dark-5 whitespace-nowrap"><span className='font-extrabold'>{'Integrity conversion'}</span></td>
                                </tr>

                                {normalise_data.map(item => {
                                    return (
                                        <tr  key={ item.id} className="bg-white">
                                           <td className="border border-b-2  whitespace-nowrap">{ item.id }</td>
                                           <td className="border border-b-2  whitespace-nowrap">{ item.name }</td>
                                            {
                                                sub_category_headers.map(sub => {
                                                    return (
                                                        <td  key={ sub.id} className="border border-b-2  whitespace-nowrap">{ item[`integrity_${sub.id}`] }</td>
                                                    )
                                                })
                                            }
                                        </tr>
                                    )
                                })}

                            </tbody>

                        </table>
                    </div>
                </div>
                  
                {allCategories.map((category, index) => {
                    return (
                        <div className="col-12 col-lg-6">
                            <div className="p-5">
                                <h1 className='font-extrabold'>Table { category.title} ({category.percentage}%)</h1>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            {headers.map(value => {
                                                return (
                                                    <th key={ value.id} className="border border-b-2 dark:border-dark-5 whitespace-nowrap">{value.label}</th>
                                                )
                                            })}

                                            {category.subCriteria.nodes.map(subCriteria => {
                                                let core = (subCriteria.type === 'CORE') ? 'font-extrabold' : '';
                                                return (
                                                    <th key={ subCriteria.id} className="border border-b-2 dark:border-dark-5 whitespace-nowrap"><span className={`${core} uppercase`}>{sub_criteria_kodes[subCriteria.id]}</span></th>
                                                )
                                            })}
                                            <td className="border border-b-2  whitespace-nowrap">{ 'NCF '}</td>
                                            <td className="border border-b-2  whitespace-nowrap">{ 'NSF' }</td>
                                            <td className="border border-b-2  whitespace-nowrap">{ `N(${index+1})` }</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {normalise_data.map(item => {
                                        return (
                                            <tr className="bg-white">
                                                <td className="border border-b-2  whitespace-nowrap">{ item.id }</td>
                                                <td className="border border-b-2  whitespace-nowrap">{ item.name }</td>
                                                {
                                                    category.subCriteria.nodes.map(sub => {
                                                        return (
                                                            <td  key={ sub.id} className="border border-b-2  whitespace-nowrap">{ item[`integrity_${sub.id}`] }</td>
                                                        )
                                                    })
                                                }
                                                <td className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>{ item[`ncf_${category.id}`] }</span></td>
                                                <td className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>{item[`nsf_${category.id}`]}</span></td>
                                                <td className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>{ item[`nTotal_${category.id}`]}</span></td>
                                            </tr>
                                        )
                                    })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )
                })}
                </Collapsible>
                <div className="col-12 col-lg-6">
                    <div className="p-5">
                        <h1 className='font-extrabold'>Table Rangking</h1>
                        <table className="table">
                            <thead>
                                <tr>
                                    <td className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>No.</span></td>
                                    <td className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>Name</span></td>
                                    {allCategories.map((category, index) => {
                                        return (
                                            <td  key={ category.id} className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'> { category.title} </span></td>
                                        )
                                        
                                    })}

                                    <td className="border border-b-2  whitespace-nowrap"><span className='font-extrabold'>Point</span></td>
                                </tr>
                            </thead>
                            <tbody>
                                {sort_normalize.map((item, index) => {
                                    let bold = 'bg-white';
                                    if(index === 0) bold = 'bg-theme-12'
                                    return (
                                        <tr className={`${bold}`}>
                                            <td className="border border-b-2  whitespace-nowrap">{ item.id }</td>
                                            <td className="border border-b-2  whitespace-nowrap">{item.name}</td>
                                            {allCategories.map((category) => {
                                                return (
                                                    <td  key={ category.id} className="border border-b-2  whitespace-nowrap"><span className='font-normal'>{ item[`nTotal_${category.id}`]}</span></td>
                                                )
                                            })}
                                            <td className="border border-b-2  whitespace-nowrap"><span className='font-normal'>{ item.total_point}</span></td>
                                        </tr>
                                    )
                                })}
                            </tbody> 
                        </table>
                    </div>
                </div>
                
            </div>
        </div>
    )

    // (40 % x N1) + (30 % x N2) + (30 % x N3) 
    
    /*
    return (
        <div className="box m-3">
            <div className="row gap-y-6 mt-5 pt-2">
                <div className="col-12 col-lg-6">
                    <div className="border-headline-table">
                        <h1 className="dark:border-dark-5 whitespace-nowrap me-auto">
                            Score Player
                        </h1>
                    </div>
                </div>
                
                <div className="col-12 col-lg-6">
                    <div className="p-5">
                        <table className="table bordered">
                            <tr>
                                {headers.map(value => {
                                    return (
                                        <th className="border border-b-2 dark:border-dark-5 whitespace-nowrap" rowSpan={2}>{value}</th>
                                    )
                                })}

                                {category_headers.map(value => {
                                    return (
                                        <th className="border border-b-2 dark:border-dark-5 whitespace-nowrap" align={'center'} colSpan={value.count}>{value.label}</th>
                                    )
                                })}

                            </tr>
                            <tr className="second-row">
                                <td className="border">1</td>
                                <td className="border">2</td>
                                <td className="border">3</td>
                                <td className="border">4</td>
                                <td className="border">5</td>
                                <td className="border">6</td>
                                <td className="border">7</td>
                                <td className="border">8</td>
                                <td className="border">9</td>
                            </tr>
                            <tr>
                                <td className="border">1</td>
                                <td className="border">2</td>
                                <td className="border">3</td>
                                <td className="border">4</td>
                                <td className="border">5</td>
                                <td className="border">6</td>
                                <td className="border">7</td>
                                <td className="border">8</td>
                                <td className="border">9</td>
                                <td className="border">10</td>
                                <td className="border">11</td>
                            </tr>
                            
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
    */
    
}

export function Rows({ title }) {
    return (
        <></>
    )

}