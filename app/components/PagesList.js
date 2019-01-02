/**
 * Created by kinneretzin on 01/09/2016.
 */

import React, { Component, PropTypes } from 'react';
import 'jquery-ui/ui/widgets/sortable';

export default class PagesList extends Component {

    static propTypes = {
        onPageSelected: PropTypes.func.isRequired,
        onPageRemoved: PropTypes.func.isRequired,
        onPageReorder: PropTypes.func.isRequired,
        onSidebarClose : PropTypes.func.isRequired,
        pages: PropTypes.array.isRequired,
        selected: PropTypes.string,
        isEditMode : PropTypes.bool.isRequired
    };

    componentDidMount() {
        $(this.refs.pages).sortable({
            placeholder: 'ui-sortable-placeholder',
            helper: 'clone',
            forcePlaceholderSize: true,
            start: (event, ui)=>this.pageIndex = ui.item.index(),
            update: (event, ui)=>this.props.onPageReorder(this.pageIndex, ui.item.index())
        });

        this._enableReorderInEditMode();
    }

    componentDidUpdate(prevProps, prevState) {
        this._enableReorderInEditMode();
    }

    _enableReorderInEditMode() {
        if (this.props.isEditMode) {
            if ($(this.refs.pages).sortable( 'option', 'disabled' )) {
                $(this.refs.pages).sortable('enable');
            }
        } else {
            if (!$(this.refs.pages).sortable( 'option', 'disabled' )) {
                $(this.refs.pages).sortable('disable');
            }
        }
    }

    render() {
        var pageCount = 0;
        this.props.pages.map(p => {
           if (!p.isDrillDown) {
               pageCount++;
           }
        });

        return (
            <div className="pages" ref="pages">
                {
                    _.filter(this.props.pages, (p)=>{return !p.isDrillDown}).map(function(page){
                        console.log('page');
                        console.log(page);
                        console.log('page');
                        /**
                         增加左侧菜单图片，以及点击选中当前菜单图片的显示，新增菜单图标以默认的图标显示
                         **/
                        let id = page.id;
                        let imagUrl = '/stage/app/images/default.png';
                        let pageIdArr = ['仪表盘','模版管理','实例化管理','vnf包管理','vim管理','vnfm管理','性能统计','策略管理','系统资源','故障管理','租户管理','计费系统'];
                        if($.inArray( id, pageIdArr ) >= 0){
                            imagUrl = '/stage/app/images/'+id+'.png';
                        }
                        //默认选中图标
                        let oldId = this.props.selected;
                        //判断新添加界面
                        if(id === oldId &&  $.inArray( id, pageIdArr ) >= 0){
                            imagUrl = '/stage/app/images/'+id+'_click.png';
                        }else if(id === oldId && $.inArray( id, pageIdArr ) < 0){
                            imagUrl = '/stage/app/images/default_click.png';
                        }
                        return <div
                                key={page.id} className={'item link ' + (this.props.selected === page.id ? 'active' : '') + ' pageMenuItem'}
                                onClick={(event) => {
                                    //点击选中图标
                                    if( $.inArray( id, pageIdArr ) > 0){
                                        $('.'+oldId+'_menu_img').attr('src','/stage/app/images/'+oldId+'.png');
                                        $('.'+page.id+'_menu_img').attr('src','/stage/app/images/'+page.id+'_click.png');
                                    }else{
                                        $('.'+page.id+'_menu_img').attr('src','/stage/app/images/default_click.png');
                                    }
                                    event.stopPropagation();
                                    this.props.onPageSelected(page);
                                    this.props.onSidebarClose();
                                }}>

                            <div className='menu_dv_img'><img src={imagUrl} className={id+'_menu_img'}></img><span>{page.name}</span></div>

                        {
                            this.props.isEditMode && pageCount != '0' ?
                                <i className="remove link icon small pageRemoveButton" onClick={(event) => {event.stopPropagation(); this.props.onPageRemoved(page)}}/>
                            :
                            ''
                        }
                        </div>
                    },this)
                }
            </div>
        );
    }
}

