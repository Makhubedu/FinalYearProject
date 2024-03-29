/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import './App.css';
import { TesseractWorker } from 'tesseract.js'
import { Redirect } from 'react-router-dom'
const Tesseract = new TesseractWorker(); //var Tesseract = window.Tesseract;


class App extends Component {
    constructor() {
        super()
        this.state = {
            uploads: [], // used for storing the documents 
            documents: [], // it will take out the otputted doc
            redirect: true
        }
    }
    handleChange = (event) => {
        if (event.target.files[0]) {
            var uploads = []
            for (var key in event.target.files) {
                if (!event.target.files.hasOwnProperty(key)) continue;
                let upload = event.target.files[key]
                uploads.push(URL.createObjectURL(upload))
            }
            this.setState({
                uploads: uploads
            })
        } else {
            this.setState({
                uploads: [],
                redirect: true
            })
        }
    }

    setRedirect = () => {
        this.setState({
            redirect: true
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
            return <Redirect to = '/downloads'/>
        }
    }

    generateText = () => {
        console.log("I am clicked")

        let uploads = this.state.uploads
        Tesseract.recognize(uploads[0])
            .progress(progress => {
                console.log('progress', progress);
            }).then(result => {
                console.log('result', result);
            });
        Tesseract
            .recognize(uploads[0])
            .catch(err => { console.error(err) })
            .then(result => {
                // Get Confidence score 
                let confidence = result.confidence
                    // Get full output 
                let text = result.text
                let pdfText = result.pdf
                    // Get codes 
                    // Update state 
                this.setState({
                    documents: this.state.documents.concat({
                        text: text,
                        confidence: confidence
                    })
                })
            })


    }
    render() {

        return (

            < div className = "app" >
            <header className = "header" >
                <h1 > NWU - IMAGE - TEXT(Tswelelo Marule) </h1> 
            </header >

            { /*This will take place when the user uploads a picture*/ }


            <section className = "hero" >
                <label className = "fileUploaderContainer" >
                Click here to upload documents
                <input type = "file" id = "fileUploader" onChange = { this.handleChange }multiple / >
                </label>

                <div > {
                    this.state.uploads.map((value, index) => {
                        return <img key = { index }
                        src = { value }
                        width = "100px" / >
                    })
                } </div>

                <button onClick = { this.generateText } className = "button" >Generate </button>  
            </section >

            { /* Results */ }

            <section className = "results" >

            {
                this.state.documents.map((value, index) => {
                    return (
                        <div key = { index }className = "results__result" >
                            <div className = "results__result__image" >
                                <img className ="image" width = "120px" src = { this.state.uploads[index] }/>
                            </div> 

                            <div className = "results__result__info" >
                                <div className = "results__result__info__codes" >
                                <small >
                                        <strong className="headerText"> Confidence Score: {value.confidence}</strong> 
                                         
                                </small > 
                                </div> <div className = "results__result__info__text" >
                                <small >
                                        <strong className="headerText"> Full Output: </strong>
                                     <p className="text">{ value.text }</p>
                                </small >
                                </div> 
                            </div >
                        </div>
                    )
                })
            } </section> 
             </div>
        )
    }
}

export default App;