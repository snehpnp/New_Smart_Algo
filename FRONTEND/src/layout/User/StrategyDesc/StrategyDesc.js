import React from 'react'
import Content from "../../../Components/Dashboard/Content/Content"
import BasicDataTable from '../../../Components/ExtraComponents/Datatable/BasicDataTable'
import { Pencil, Trash2 } from 'lucide-react';


const StrategyDesc = () => {


    return (
        <Content Page_title="Strategy Description" button_status={false}>
            <div class="container-fluid">

                <div class="row mb-5">
                    <div class="col-12 col-sm-6 col-md-3">
                        <div class="card card-purple-blue text-white mb-3 mb-md-0">
                            <div class="d-flex justify-content-space-between " >
                                <div>
                                    <p class="new-un">Undefined</p>
                                </div>
                                <div>
                                    <p class="new-de">Undefined</p>
                                </div>
                            </div>
                            <h4 class="card-new-heading">Test</h4>
                            <div class="card-body d-flex justify-content-between align-items-end">
                                <div class="card-number">
                                    <div class="h3">Recommended</div><small><strong>Capital : undefined PER LOT</strong></small>
                                </div>
                                <div class="card-description text-right">
                                    <small class="new-sma">Info</small>
                                </div>
                                <div class="card-description text-right ml-3">
                                    <small class="new-sma">Join</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                        <div class="card card-salmon-pink text-white">
                            <div class="d-flex justify-content-space-between" >
                                <div>
                                    <p class="new-un">Undefined</p>
                                </div>
                                <div>
                                    <p class="new-de">Undefined</p>
                                </div>
                            </div>
                            <h4 class="card-new-heading">Test1</h4>
                            <div class="card-body d-flex justify-content-between align-items-end">
                                <div class="card-number">
                                    <div class="h3">Recommended</div><small><strong>Capital : 99999 PER LOT</strong></small>
                                </div>
                                <div class="card-description text-right">
                                    <small class="new-sma">Info</small>
                                </div>
                                <div class="card-description text-right ml-3">
                                    <small class="new-sma">Join</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                        <div class="card card-blue-green text-white">
                            <div class="d-flex justify-content-space-between" >
                                <div>
                                    <p class="new-un">Undefined</p>
                                </div>
                                <div>
                                    <p class="new-de">Undefined</p>
                                </div>
                            </div>
                            <h4 class="card-new-heading">Test2</h4>
                            <div class="card-body d-flex justify-content-between align-items-end">
                                <div class="card-number">
                                    <div class="h3">Recommended</div><small><strong>Capital : 99999 PER LOT</strong></small>
                                </div>
                                <div class="card-description text-right">
                                    <small class="new-sma">Info</small>
                                </div>
                                <div class="card-description text-right ml-3">
                                    <small class="new-sma">Join</small>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 col-sm-6 col-md-3">
                        <div class="card card-purple-pink text-white">
                            <div class="d-flex justify-content-space-between" >
                                <div>
                                    <p class="new-un">Undefined</p>
                                </div>
                                <div>
                                    <p class="new-de">Undefined</p>
                                </div>
                            </div>
                            <h4 class="card-new-heading">Test3</h4>
                            <div class="card-body d-flex justify-content-between align-items-end">
                                <div class="card-number">
                                    <div class="h3">Recommended</div><small><strong>Capital : 99999 PER LOT</strong></small>
                                </div>
                                <div class="card-description text-right">
                                    <small class="new-sma">Info</small>
                                </div>
                                <div class="card-description text-right ml-3">
                                    <small class="new-sma">Join</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Content>
    )
}


export default StrategyDesc
