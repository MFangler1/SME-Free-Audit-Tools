
import { google } from 'googleapis'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

interface AssessmentData {
  fullName: string
  email?: string
  assessmentType: string
  readinessScore: number
  keyRiskAreas: string
  recommendationsSummary: string
  reportUrl: string
}

export async function appendToGoogleSheets(assessmentData: AssessmentData) {
  try {
    // Skip if Google Sheets credentials are not configured
    if (!process.env.GOOGLE_SHEETS_CREDENTIALS || !process.env.GOOGLE_SHEETS_SPREADSHEET_ID) {
      console.log('Google Sheets integration not configured. Skipping...')
      return { success: false, message: 'Not configured' }
    }

    // Parse credentials from environment variable
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS)
    
    // Create auth client
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const spreadsheetId = process.env.GOOGLE_SHEETS_SPREADSHEET_ID

    // Get UK timezone timestamp in ISO format
    const ukTimestamp = new Date().toLocaleString('en-GB', { 
      timeZone: 'Europe/London',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    })

    // Prepare the row data per required column order:
    // 1) Timestamp (UK), 2) Client name, 3) Client email, 4) Assessment type,
    // 5) Score, 6) Key risk areas, 7) Recommendations summary, 8) Report URL
    const row = [
      ukTimestamp,
      assessmentData.fullName,
      assessmentData.email || '',
      assessmentData.assessmentType,
      assessmentData.readinessScore,
      assessmentData.keyRiskAreas,
      assessmentData.recommendationsSummary,
      assessmentData.reportUrl
    ]

    // Check if the sheet exists, if not create it with headers
    const sheetName = 'Sheet1'
    
    try {
      // Try to get the sheet
      const spreadsheet = await sheets.spreadsheets.get({
        spreadsheetId,
      })

      const sheet = spreadsheet.data.sheets?.find(
        (s) => s.properties?.title === sheetName
      )

      if (!sheet) {
        // Create the sheet with headers
        await sheets.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: {
            requests: [
              {
                addSheet: {
                  properties: {
                    title: sheetName,
                  },
                },
              },
            ],
          },
        })

        // Add headers
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetName}!A1:H1`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [[
              'Timestamp (UK)',
              'Client Name',
              'Client Email',
              'Assessment Type',
              'Score (0-100)',
              'Key Risk Areas',
              'Recommendations Summary',
              'Report URL'
            ]],
          },
        })
      }
    } catch (error) {
      console.error('Error checking/creating sheet:', error)
    }

    // Append the row to Sheet1!A:Z
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${sheetName}!A:Z`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [row],
      },
    })

    return { success: true, message: 'Data appended to Google Sheets' }
  } catch (error) {
    console.error('Error appending to Google Sheets:', error)
    return { success: false, message: error instanceof Error ? error.message : 'Unknown error' }
  }
}

export async function createOrGetSpreadsheet(sheetTitle: string = 'AI Assessment Lead Gen') {
  try {
    if (!process.env.GOOGLE_SHEETS_CREDENTIALS) {
      throw new Error('Google Sheets credentials not configured')
    }

    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS)
    
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: SCOPES,
    })

    const sheets = google.sheets({ version: 'v4', auth })
    const drive = google.drive({ version: 'v3', auth })

    // Create a new spreadsheet
    const spreadsheet = await sheets.spreadsheets.create({
      requestBody: {
        properties: {
          title: sheetTitle,
        },
        sheets: [
          {
            properties: {
              title: 'CLIENT - AI Assessment',
            },
          },
        ],
      },
    })

    const spreadsheetId = spreadsheet.data.spreadsheetId

    // Make it accessible (optional - you might want to remove this for security)
    await drive.permissions.create({
      fileId: spreadsheetId!,
      requestBody: {
        role: 'writer',
        type: 'anyone',
      },
    })

    // Add headers
    await sheets.spreadsheets.values.update({
      spreadsheetId: spreadsheetId!,
      range: 'CLIENT - AI Assessment!A1:O1',
      valueInputOption: 'RAW',
      requestBody: {
        values: [[
          'Timestamp',
          'Full Name',
          'Position',
          'Company Name',
          'Company URL',
          'Email',
          'Phone Number',
          'AI Awareness',
          'Business Processes',
          'Budget Range',
          'Team Size',
          'Pain Points',
          'Industry',
          'Readiness Score',
          'Additional Info'
        ]],
      },
    })

    return {
      success: true,
      spreadsheetId,
      url: `https://docs.google.com/spreadsheets/d/${spreadsheetId}`,
    }
  } catch (error) {
    console.error('Error creating spreadsheet:', error)
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
