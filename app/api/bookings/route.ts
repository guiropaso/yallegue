import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { service, payload } = body;

    // Validate required fields
    if (!service || !payload) {
      return NextResponse.json(
        { error: 'Service and payload are required' },
        { status: 400 }
      );
    }

    // Validate service type
    const validServices = ['airbnb', 'house', 'repair'];
    if (!validServices.includes(service)) {
      return NextResponse.json(
        { error: 'Invalid service type' },
        { status: 400 }
      );
    }

    // Basic validation for required fields
    const requiredFields = ['nombre', 'telefono', 'email', 'direccion', 'fecha'];
    for (const field of requiredFields) {
      if (!payload[field] || !payload[field].trim()) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Service-specific validation
    if (service === 'house') {
      if (!payload.horario || !payload.tier) {
        return NextResponse.json(
          { error: 'Missing required fields for house cleaning' },
          { status: 400 }
        );
      }
    }

    if (service === 'repair') {
      if (!payload.tipoEquipo || !payload.descripcion) {
        return NextResponse.json(
          { error: 'Missing required fields for repair service' },
          { status: 400 }
        );
      }
    }

    // Here you would typically save to a database
    // For now, we'll just log the booking
    console.log('New booking received:', {
      service,
      payload,
      timestamp: new Date().toISOString(),
    });

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json(
      { 
        success: true, 
        message: 'Booking received successfully',
        bookingId: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error processing booking:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
