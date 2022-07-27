import React, { useState, useEffect } from 'react';
import PrivateLayout from '@components/layout/privateLayout';
import { Printer, Circle, XCircle } from 'react-feather'
import Select from 'react-select';
import { positions, types as typePositions } from '@helpers/position';
import { GET_ALL_PLAYER_BY_POSITION_AND_GET_SCORES } from "@gql/player";
import { GET_CRITERIA_WITH_ALL_CHILDS, QUERY_ALL_CRITERIA } from "@gql/criteria";
import { QUERY_ALL_GAPS } from "@gql/gaps";
import { ADD_RATING } from '@gql/rating';
import { useQuery, useLazyQuery, useMutation  } from "@apollo/client";
import { getWeek } from '@helpers/date';
import Toastify from "toastify-js";
import { TableItem } from '@components/table/calculation';
import { calculate } from '@helpers/calculation';
import { useTranslation } from 'react-i18next';

const Calculate = () => {
    const { t } = useTranslation();
    const [filter, setFilter] = useState({});
    const [errors, setError] = useState(false);
    const [progress, setProgress] = useState(false);
    const [result, setResult] = useState(false);
    const [nodes, setNodes] = useState([]);
    const [empty, setEmpty] = useState(false);
    const [allCategories, setAllCategories] = useState([]);
    const [allGaps, setAllGaps] = useState([]);
    const [normalize, setNormalize] = useState([]);
    const [isPrinting, setIsPrinting] = useState(false);

    const [addRating, { loading: addRatingLoading }] = useMutation(ADD_RATING, {
		onCompleted: (data) => {
            
		}
	});

    const criteria = useQuery(GET_CRITERIA_WITH_ALL_CHILDS, {
		onCompleted: (data) => {
		  const _allCategories = data?.allCategories?.nodes ?? [];
			setAllCategories(_allCategories)
		}
	})

    const getAllGaps = useQuery(QUERY_ALL_GAPS, {
        variables: {
            first: 200
        },
		onCompleted: (data) => {
		    const _allGaps = data?.allGaps?.nodes ?? [];
            setAllGaps(_allGaps)
		}
	})

    const [fetchPlayers, { loading, error, data }] = useLazyQuery(GET_ALL_PLAYER_BY_POSITION_AND_GET_SCORES, {
        fetchPolicy: "no-cache",
        onCompleted: (data) => {
            setNodes(data.allPlayers.nodes);
            if(data.allPlayers.totalCount <= 0) {
                Toastify({
                    text: "There is no data found!",
                    duration: 3000,
                    newWindow: true,
                    close: false,
                    gravity: "top",
                    position: "right",
                    stopOnFocus: true,
    
                }).showToast();

                setEmpty(true);
            }
            else {
                setEmpty(false);
            }
        }
    });


    const handleSelectChange = (key, event, isMulti = false) => {

		if (isMulti) {
			let array = []
			event.forEach(e => {
				array.push(e.value)
			})
			setFilter((prev) => ({ ...prev, [key]: array }))
		} else {
			setFilter((prev) => ({ ...prev, [key]: event.value }))
		}
    };
    
    const handleSubmit = (e) => {
        e.preventDefault()
        setError(false);
        setProgress(true);
        setResult(false);
        if (!filter?.position) {
            setError(true);
            Toastify({
                text: t("Please choose position!"),
                duration: -1,
                newWindow: true,
                close: false,
                gravity: "top",
                position: "right",
                stopOnFocus: true,

            }).showToast();

            setProgress(false)
            setResult(false);
        }
        else {
            
            const variables = {
                ScoreCondition: { week: getWeek() },
                PlayerCondition: filter
            };

            if (filter.position === 'all') variables.PlayerCondition = {};

            fetchPlayers({ variables: variables })
                .then(() => setResult(true))
                .then(() => {
                    setTimeout(() => {
                        setProgress(false)
                    }, 2000);
                })
        }
    }

    /*
    const MarkupResult = () => {
        return positions.map(position => {
            const { value, label } = position;
            let players = nodes.filter(node => node.position === value);
            return (
                <TableItem key={value} title={label} nodes={players} allCategories={allCategories} position={value} allGaps={allGaps} sort_normalize={ normalize } />
            )
        })
        
    }
    */
    
    
    useEffect(() => {
        const calc = async () => {
            if (nodes.length > 0) {
                let _positions = positions;
                if (filter?.position && filter.position != 'all') _positions = positions.filter(p => p.value === filter.position);
                const items = await Promise.all(_positions.map(position => {
                    const { value, label } = position;
                    let players = nodes.filter(node => node.position === value);
                    const scores = calculate({
                        nodes: players,
                        allCategories: allCategories, 
                        position: value,
                        allGaps: allGaps,
                        title: label,
                    })

                    let highScore = scores.sort_normalize.find(element => element !== undefined);
                    if (highScore?.total_point && highScore.total_point > 0) {
                        const today = new Date();
                        let variables = {}
                        variables.createdAt = today;
                        variables.result = {
                            point: highScore.total_point,
                            playerName: highScore.name,
                            playerID: highScore.id,
                            node_Id: highScore.node_Id,
                            pic: highScore.photo,
                        }
                        variables.week = getWeek();
                        variables.year = today.getFullYear();
                        variables.position = value;
                        variables.playerId = highScore.playerId;
                        addRating({ variables });
                        console.log(variables)
                        console.log('SAVING NOW', variables)
                    }

                    return scores
        
                }))

                setNormalize(items);
                console.log('items', items)
            }   
            else {
                setNormalize([]);
                
            }
        }

        return calc();

    }, [nodes]);
    
    const MarkupResult = () => {
        return normalize.map((items, index) => {
            return (
                <TableItem key={`normalize-${index}`} params={items} isPrinting/>
            )
        })
        
    }

    const printItems = () => {
        setIsPrinting(true);
        window.print();
    };
    
    return (
        <PrivateLayout>
			<div className="hidePrinting intro-y box p-2 mt-5">
				<form onSubmit={(e) => handleSubmit(e)}>
					<div className="grid grid-cols-12">

						<div className="col-span-3 lg:col-span-3 p-3">
							<div className="mt-0">
								<label htmlFor="crud-form-6" className="form-label">{t('Choose Position To Proccess')} <span className="text-theme-6">*</span></label>
								<Select
									id="crud-form-6"
                                    placeholder={t('Choose One..')}
                                    className={(error || errors) ? 'border-theme-6' : '' }
                                    options={[
                                        {
                                            label: t("All Positions"),
                                            value: "all"
                                        },
                                        ...positions
                                        
                                    ]}
									value={positions.find(e => e.value == filter.position)}
									onChange={(e) => handleSelectChange('position', e)}
                                />
                                <div className="pristine-error text-theme-6 mt-2" style={{ display: (errors) ?  'block' : 'none' }}>{t('This field is required')}</div>
                            </div>
                           
						</div>
                        <div className="col-span-6 lg:col-span-6 pt-5">
                            <div className="text-left mt-5">
                                <label htmlFor="crud-form-6" className="form-label">&nbsp;</label>
                                <button type="submit" className="btn btn-primary">
                                    {(progress) ? (
                                        <>
                                        <span className="mr-2">{t('Please wait...')} </span>
                                            <Circle className='w-6 h-6 mr-2 spinner' />
                                        </>
                                    ) : t('Process')}
                                    
                                </button>
							</div>
                        </div>
						
					</div>
				</form>
            </div>
            
            
            {(result) ? (<div className='intro-y'>
                <MarkupResult/>                        
                <div className="flex mt-5" style={{display: 'block', textAlign: 'right'}}>
                    <button onClick={printItems} id="tabulator-print" className="btn btn-outline-secondary hidePrinting w-1/2 sm:w-auto mr-2"> <Printer className="w-4 h-4 mr-2"/> Print </button>
                </div> 
            </div>) : (<></>)}
            {(empty) ? (<div className='intro-y mt-3'>
                <div className="alert alert-warning show flex items-center mb-2" role="alert"> <XCircle className='w-6 h-6 mr-2' /> {t('There\'s no data found...')} </div>                  
            </div>) : (<></>)}

        </PrivateLayout>)

}

export default Calculate;