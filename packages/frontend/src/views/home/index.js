import React, { useEffect, useState } from 'react';
import PrivateLayout from '@components/layout/privateLayout';
import { Overview  } from '@components/table/overview';
import Preview from './preview';
import { ALL_RATINGS } from '@gql/rating';
import { useQuery } from '@apollo/client';
import { positions } from '@helpers/position';
import Tabulator from "tabulator-tables";
import Select from 'react-select';
import { Printer } from 'react-feather'
import { useTranslation } from 'react-i18next';
const formatImage_ = (cell) => `<div class="w-6 h-100 max-h-full"><img class="image-relative" src="${(cell.getValue()) ? cell.getValue() :  '/logo512.png'}"></div>`

const Dashboard = () => {
    const { t } = useTranslation();
    const [ratings, setRatings] = useState([]);
    const [lineUps, setLineUps] = useState([]);
    const [formation, setFormation] = useState('442');
    const [tbl, setTbl] = useState();
    // Similar to componentDidMount and componentDidUpdate:
    useEffect(() => {
        setup();
    }, [ratings]);

    const setup = () => {
        let tableData = {};
        ratings.forEach((rating, index) => {
            const item = {};
            const { result = {} } = rating 
            item.no = index + 1;
            item.number = result?.playerID ?? null;
            item.name = result?.playerName ?? null;
            item.pic = result?.pic ?? null;
            item.position = rating?.position ?? null;
            item.point = result?.point ?? 0.00;
            if (!tableData[item.number]) tableData[item.number] = item;
        })

        let quantities = {
            LB: 1,
            CB: 2,
            RB: 1,
            CMF: 2,
            AMF: 1,
            CF: 1,
            GK: 1
        }

        let _lineUps = {};
        positions.forEach(pos => {
            let items = Object.values(tableData).filter(player => player.position === pos.value)
            items = (items.length) ? items.sort(function (x, y) {
                return y.point - x.point;
            }) : []; 
            
            if (quantities[pos.value] >= items.length) {
                //_lineUps = { ..._lineUps, [pos.value]: items }
                //_lineUps[pos.value] = items;
            }
            else {
                if (items.length > 0) {
                    const diff = items.length - quantities[pos.value];
                    if (diff > 0) {
                        items.splice(quantities[pos.value], diff)
                    }
                }

                //_lineUps = { ..._lineUps, [pos.value]: items }
                //_lineUps[pos.value] = items;
            }

            if (items.length > 0) {
                items.forEach((t => {
                    if (!_lineUps[t.number]) _lineUps[t.number] = t;
                }))
            }
            
        })

        tableData = _lineUps;

        /*
        let lineUps = _lineUps;
        let stocks = players;
        let optionals = {
            LB: ['RB', 'CB', 'DM'],
            CB: ['RB', 'LB', 'DM'],
            CB: ['RB', 'LB', 'DM'],
            RB: ['LB','CB', 'DM'],
            CMF: ['DM', 'CB', 'CMD'],
            AMF: ['CMD', 'CF', 'RWF', 'LWF'],
            CF: ['AMF','CMD', 'RWF', 'LWF'],
        }

        

        for (const pos in lineUps) {
            if (lineUps[pos].length < quantities[pos]) {
                if (stocks.length > 0){
                    stocks.forEach((stock, index) => {
                        if (lineUps[stock.position].length > quantities[stock.position]   && optionals[pos].includes(stock.position)) {
                            lineUps[pos].push(stock);
                            stocks.splice(index, 1)
                        }
                    })
                }
            }
        }
        */
        
        let number = 1;
        const autoNumber = () => {
            return number++;
        }
            
        
        const table = new Tabulator("#rating-table", {
            data: Object.values(tableData), //set initial table data
            layout: "fitColumns",
            responsiveLayout: "collapse",
            placeholder: "No matching records found",
            printAsHtml: true,
            printStyled: true,
            columns:[
                {title:"#", field:"no", width: 100, mutator : autoNumber, headerSort: false},
                {title: t("Number"), field:"number", width: 100},
                {title:t("Name"), field:"name", width: 400},
                {title:t("Pic."), field:"pic", formatter: formatImage_, headerSort: false},
                {title:t("Position"), field:"position"},
                {title:t("Score"), field:"point", formatter: (cell) => `<button class="btn btn-rounded btn-dark me-1 ">${cell.getValue()}</button>`},
            ],
        }) 

       
        setLineUps(Object.values(tableData));
        setTbl(table)
    }

    const printMe = () => {
        tbl.print();
    }

    const { loading, error, data: ratings_data } = useQuery(ALL_RATINGS, {
        fetchPolicy: 'no-cache',
		variables: {
            in: positions.map(pos => pos.value),
            first: 50000
		},
		onCompleted: (data) => {
		    // const _allCategories = data?.allCategories?.nodes ?? [];
            setRatings(data?.allRatings?.nodes)
		}
	})

    return (<PrivateLayout>
        <div className="grid grid-cols-12 gap-6" style={{display: 'none'}}>
            <div className="col-span-12 2xl:col-span-12">
                <div className="col-span-12 2xl:col-span-3">
                    <div className="2xl border-theme-5 -mb-10 pb-10">
                        <div className="2xl:pl-6 grid grid-cols-12 gap-6">
                            {/** BEGIN: Transactions */}
                            <div className="col-span-12 md:col-span-12 xl:col-span-12 2xl:col-span-12 mt-3">
                                <div className="intro-x flex items-center h-10">
                                    <h1 className="text-lg font-bold mr-5">
                                        {t('Rating player of the week')}
                                    </h1>
                                    <div className="form-check form-switch w-sm-auto ms-sm-auto mt-3 mt-sm-0 ps-0">
                                        <button className='btn btn-success w-24 me-1 mb-2'><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={"1.5"} strokeLinecap="round" strokeLinejoin="round" className="feather feather-refresh-cw d-block mx-auto"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg></button>
                                    </div>
                                </div>
                                <div className="mt-5"><Overview/></div>
                            </div>
                            {/** END: Transactions */}

                        </div>
                    </div>
                </div>
            </div>
        </div>
        {(loading) ? (<p>Loading...</p>): (
            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 2xl:col-span-8">
                    <div style={{ position: 'relative', maxWidth: '1024px', display: "none"}}>
                    <div className="mt-4" style={{
                        position: 'absolute',
                        zIndex: '5',
                        right: '20px',
                        top: '2.5em',
                    }}>
                        <Select
                            id="crud-form-6"
                            placeholder={t('Choose formation..')}
                            options={[
                                {
                                    label: "4-4-2",
                                    value: "442",
                                },
                                {
                                    label: "4-2-1-3",
                                    value: "4213",
                                },
                                {
                                    label: "4-2-3-1",
                                    value: "4231",
                                }
                            ]}
                            value={formation}
                            onChange={(e) => {
                                setFormation(e.value)
                            }}
                        />
                        </div>
                    </div>
                    {(lineUps.length) ? ( <Preview players={lineUps} formations={ formation } />) : (null)}
                   
                </div>
            <div className="col-span-12 lg:col-span-12 px-0 pt-0 pb-0">
                <div className="intro-y mt-0">
                    <div className="d-flex flex-column flex-sm-row align-items-center p-5 px-0 border-bottom border-gray-200 dark-border-dark-5">
                        <h4 className="text-md font-medium mr-auto">
                            {t('Last Line Up This Week')}
                        </h4>
                    </div>
                    <div className="intro-y box p-5 mt-0">
                            <div className="preview">
                                <div className="flex mt-5 mb-3 sm:mt-0" style={{display: 'block', textAlign: 'right'}}>
                                    <button onClick={printMe} id="tabulator-print" className="btn btn-outline-secondary w-1/2 sm:w-auto mr-2"> <Printer className="w-4 h-4 mr-2"/> Print </button>
                                </div> 
                                <div className="overflow-x-auto">
                                    <div id="rating-table"></div>
                                </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )}
        
        
        
        
    </PrivateLayout>
    );
}
export default Dashboard