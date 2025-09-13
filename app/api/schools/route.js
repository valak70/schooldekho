import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import path from 'path';
import { writeFile } from 'fs/promises';
import cloudinary from '@/lib/cloudinary';
import { verifyToken } from '@/lib/auth';
import { cookies } from 'next/headers';

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


async function requireAuth() {
  const cookieStore = await cookies();   
  const token = cookieStore.get('token')?.value;
  if (!token) return null;

  try {
    return verifyToken(token);
  } catch {
    return null;
  }
}


// GET all schools (public)
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

// CREATE school (protected)
export async function POST(request) {
  try {
    if (!requireAuth()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

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

// UPDATE school (protected)
export async function PUT(request) {
  try {
    if (!requireAuth()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'School ID is required' }, { status: 400 });
    }

    const data = await request.formData();
    const norm = (v) => {
      if (v == null) return null;
      const s = String(v).trim();
      if (s === '' || s.toLowerCase() === 'null' || s.toLowerCase() === 'undefined') return null;
      return s;
    };
    let imageUrl = norm(data.get('existingImage'));
    const image = data.get('image');
    const hasNewFile = image && typeof image === 'object' && 'name' in image && image.name;

    if (hasNewFile) {
      const buffer = await fileToBuffer(image);
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
    }
    let sql;
    let values;

    if (imageUrl) {
      sql = `
        UPDATE schools
        SET name=?, address=?, city=?, state=?, contact=?, email_id=?, image=?
        WHERE id=?
      `;
      values = [
        norm(data.get('name')),
        norm(data.get('address')),
        norm(data.get('city')),
        norm(data.get('state')),
        norm(data.get('contact')),
        norm(data.get('email_id')),
        imageUrl,
        id,
      ];
    } else {
      sql = `
        UPDATE schools
        SET name=?, address=?, city=?, state=?, contact=?, email_id=?
        WHERE id=?
      `;
      values = [
        norm(data.get('name')),
        norm(data.get('address')),
        norm(data.get('city')),
        norm(data.get('state')),
        norm(data.get('contact')),
        norm(data.get('email_id')),
        id,
      ];
    }

    await pool.query(sql, values);

    return NextResponse.json({ message: 'School updated successfully!' });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}


// DELETE school (protected)
export async function DELETE(request) {
  try {
    if (!requireAuth()) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'School ID is required' },
        { status: 400 }
      );
    }

    await pool.query('DELETE FROM schools WHERE id=?', [id]);

    return NextResponse.json({ message: 'School deleted successfully!' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
