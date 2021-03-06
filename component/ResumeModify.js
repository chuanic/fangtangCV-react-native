import React, { Component } from 'react';
import { observer , inject } from 'mobx-react';
import { withRouter, Redirect } from 'react-router-native';
import { View, Text, TextInput, Button, TouchableNativeFeedback } from 'react-native';
import BackBar from './BackBar';
import FtView from './FtView';
import Icon from 'react-native-vector-icons/MaterialIcons';

const FtIcon = ( props ) => <Icon name={props.name} size={24} color="#03a9f4"/>; 

@withRouter
@inject("store")
@observer
export default class ResumeModify extends Component
{
    constructor(props)
    {
        super( props );
        this.state = {"title":"","content":"","id":0,"redir":false};
    }

    async componentDidMount()
    {
        const data = await this.props.store.get_resume( this.props.match.params.id );
        
        if( parseInt( data.code , 10 ) === 0  )
            this.setState( {"id":data.data.id,"title":data.data.title,"content":data.data.content} );
        else
            alert( data.error );          
    }

    async update()
    {
        if( this.state.title.length === 0 ||  this.state.content.length === 0 )
        {
            alert("简历名称和内容均为必填项");
            return false;
        }
        
        let data = await this.props.store.update( this.state.id , this.state.title , this.state.content );

        if( parseInt( data.code , 10 ) === 0  )
        {
            //await this.props.store.get_my_resume();
            //await this.props.store.get_all_resume();
            //this.setState( {"redir":true} );
            this.props.history.go(-1);
        }
            
        else
            alert( data.error );    
        // if( this.props.store.register( this.state.email , this.state.password ))
    }

    handleChange( text , field )
    {
        let o = {};o[field] = text;
        this.setState( o );
    }
    
    render()
    {
        const save = <TouchableNativeFeedback onPress={()=>this.update()}><View><FtIcon name="save" /></View></TouchableNativeFeedback>;
        return <View>
            <BackBar title="修改简历" right={save} />

            <FtView><TextInput placeholder="简历标题" value={this.state.title} onChangeText={(text)=>{this.handleChange(text,"title");}} /></FtView>
            <FtView><TextInput placeholder="简历内容" value={this.state.content} onChangeText={(text)=>{this.handleChange(text,"content");}} multiline = {true} /></FtView>
            <FtView><Button title="更新" onPress={()=>this.update()}/></FtView>
        </View>;
    }
}