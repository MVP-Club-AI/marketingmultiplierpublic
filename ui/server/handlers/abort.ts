import { Request, Response } from 'express'

/**
 * Handles POST /api/abort/:requestId requests to cancel ongoing chat requests
 */
export function handleAbortRequest(
  req: Request<{ requestId: string }>,
  res: Response,
  abortControllers: Map<string, AbortController>,
) {
  const requestId = req.params.requestId
  const controller = abortControllers.get(requestId)

  if (controller) {
    console.log('Aborting request:', requestId)
    controller.abort()
    abortControllers.delete(requestId)
    res.json({ success: true, message: 'Request aborted' })
  } else {
    res.status(404).json({
      success: false,
      error: 'Request not found or already completed'
    })
  }
}
