import { Request, Response } from "express";
import { returnResponse } from "../utils/response.utils";
import { esClient } from "../configs/elasticsearch.config";
import { StatusCode } from "../enums/status-code.enum";

interface ElasticBody {
  attendanceId: number;
  userId: number;
  clockIn: Date;
  clockOut: Date | null;
}

export async function save(req: Request, res: Response, body: ElasticBody, index: string) {
  try {
    const data = await esClient.index({
      index: index,
      body: body
    });
  } catch (error) {
    returnResponse(res, StatusCode.SERVER_ERROR, false, [], "Internal server error");
  }
}

export async function searchWithUpdate(req: Request, res: Response, index: string, body: Object, attendanceId: number) {
  try {
    const data = await esClient.search({
      index: index,
      body: {
        query: {
          bool: {
            filter: [
              { term: { attendanceId: attendanceId } }
            ]
          }
        }
      }
    });

    if (data.hits.hits.length === 0) {
      returnResponse(res, StatusCode.NOT_FOUND, false, [], "Data not found");
      return;
    }

    const firstHit = data.hits.hits[0];
    const documentId = firstHit._id;

    if (!documentId) {
      returnResponse(res, StatusCode.NOT_FOUND, false, [], "Document ID not found");
      return;
    }

    await esClient.update({
      index: index,
      id: documentId,
      body: body
    });
  } catch (error) {
    returnResponse(res, StatusCode.SERVER_ERROR, false, [], "Internal server error");
  }
}