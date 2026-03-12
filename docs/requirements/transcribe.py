import google.generativeai as genai
import sys, os

# Get API key from environment variable
api_key = os.environ.get('GEMINI_API_KEY')
if not api_key:
    print('Error: GEMINI_API_KEY environment variable not set.')
    sys.exit(1)

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash')

audio_file_path = 'output.wav'
try:
    print('Uploading audio file to Gemini API...')
    myfile = genai.upload_file(audio_file_path)
    
    print('Generating transcript...')
    result = model.generate_content([myfile, 'Please transcribe this audio file verbatim in Korean.'])
    
    # Save transcription
    with open('transcript.txt', 'w', encoding='utf-8') as f:
        f.write(result.text)
    print('Transcription saved to transcript.txt')
    
    # Clean up file on Gemini
    try:
         for file in genai.list_files():
              print(f"cleaning up {file.name}")
              file.delete()
         print('Cleaned up file from Gemini API.')
    except Exception as e:
         print(f'Warning: Could not delete file: {e}')
         
except Exception as e:
    print(f'Error during transcription: {e}')
