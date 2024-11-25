from dash import Dash, html, dcc, Input, Output, State
import dash_bootstrap_components as dbc
import base64
import librosa
import numpy as np
import os

# Initialize Dash app
app = Dash(__name__, suppress_callback_exceptions=True, external_stylesheets=[dbc.themes.BOOTSTRAP])

# App layout
app.layout = html.Div([
    dcc.Location(id='url', refresh=False),
    html.Div(id='page-content')  # Dynamic content based on URL
])

# Welcome Page
def welcome_page():
    return html.Div([
        html.H1("Welcome to EngageSense", style={'textAlign': 'center'}),
        html.P("Analyze audio files or record live to extract engagement metrics.", style={'textAlign': 'center'}),
        html.Div([
            dcc.Link('Upload Audio or Record Live', href='/upload', className='btn btn-primary', style={'margin': '10px'}),
            dcc.Link('View Results Dashboard', href='/dashboard', className='btn btn-secondary', style={'margin': '10px'}),
        ], style={'textAlign': 'center'})
    ])

# Upload/Record Page
def upload_page():
    return html.Div([
        html.H1("Upload Audio or Record Live", style={'textAlign': 'center'}),
        dcc.Upload(
            id='upload-audio',
            children=html.Div(['Drag and Drop or ', html.A('Select an Audio File')]),
            style={
                'width': '100%',
                'height': '60px',
                'lineHeight': '60px',
                'borderWidth': '1px',
                'borderStyle': 'dashed',
                'borderRadius': '5px',
                'textAlign': 'center',
                'margin': '10px'
            },
            multiple=False
        ),
        html.Div(id='audio-analysis-output', style={'marginTop': '20px'}),
        dcc.Link('Back to Home', href='/', className='btn btn-secondary', style={'marginTop': '20px'})
    ])

# Dashboard Page
def dashboard_page():
    return html.Div([
        html.H1("Engagement Results Dashboard", style={'textAlign': 'center'}),
        html.Div(id='dashboard-output'),
        dcc.Link('Back to Home', href='/', className='btn btn-secondary', style={'marginTop': '20px'})
    ])

# Page navigation
@app.callback(
    Output('page-content', 'children'),
    [Input('url', 'pathname')]
)
def display_page(pathname):
    if pathname == '/upload':
        return upload_page()
    elif pathname == '/dashboard':
        return dashboard_page()
    else:
        return welcome_page()

# Audio file analysis
@app.callback(
    Output('audio-analysis-output', 'children'),
    [Input('upload-audio', 'contents')],
)
def analyze_audio(contents):
    if contents:
        # Decode and save audio file
        content_type, content_string = contents.split(',')
        decoded = base64.b64decode(content_string)
        filename = "uploaded_audio.wav"
        with open(filename, "wb") as f:
            f.write(decoded)

        # Analyze audio with Librosa
        try:
            y, sr = librosa.load(filename, sr=None)
            tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
            rms = np.mean(librosa.feature.rms(y=y))
            os.remove(filename)  # Clean up after analysis

            # Return results
            return html.Div([
                html.P(f"Tempo: {tempo:.2f} BPM"),
                html.P(f"Average RMS Energy: {rms:.2f}")
            ])
        except Exception as e:
            return html.Div([
                html.P("Error processing audio."),
                html.P(str(e))
            ])
    return html.P("No audio uploaded yet.")

# Run the Dash app
if __name__ == '__main__':
    app.run_server(debug=True)
