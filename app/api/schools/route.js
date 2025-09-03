import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import path from 'path';
import { writeFile } from 'fs/promises';
import cloudinary from '@/lib/cloudinary';

export const runtime = 'nodejs';

async function fileToBuffer(file) {
  if (file.arrayBuffer) {
    return Buffer.from(await file.arrayBuffer());
  }
  if (file.stream) {
    const chunks = [];
    for await (const chunk of file.stream()) {
      chunks.push(chunk);
    }
    return Buffer.concat(chunks);
  }
  if (file.buffer) {
    return Buffer.from(file.buffer);
  }
  throw new Error('Unsupported file type from formData()');
}

async function uploadToCloudinary(buffer) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      if (result) resolve(result);
      else reject(error);
    });
    stream.end(buffer);
  });
}

export async function GET() {
  try {
    const [results] = await pool.query(
      'SELECT id, name, address, city, image FROM schools'
    );
    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.formData();
    const image = data.get('image');

    if (!image) {
      return NextResponse.json(
        { error: 'Image file is required.' },
        { status: 400 }
      );
    }

    const buffer = await fileToBuffer(image);

    let imageUrl = '';

    if (process.env.USE_CLOUDINARY === 'true') {
      const result = await uploadToCloudinary(buffer);
      imageUrl = result.secure_url;
    } else {
      const filename = `${Date.now()}_${image.name.replaceAll(' ', '_')}`;
      const localPath = path.join(process.cwd(), 'public/schoolImages');
      const fullPath = path.join(localPath, filename);
      await writeFile(fullPath, buffer);
      imageUrl = `/schoolImages/${filename}`;
    }

    const schoolData = {
      name: data.get('name'),
      address: data.get('address'),
      city: data.get('city'),
      state: data.get('state'),
      contact: data.get('contact'),
      email_id: data.get('email_id'),
      image: imageUrl,
    };

    const sql =
      'INSERT INTO schools (name, address, city, state, contact, email_id, image) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const values = Object.values(schoolData);

    await pool.query(sql, values);

    return NextResponse.json({ message: 'School added successfully!' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
