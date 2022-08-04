// TODO: maybe make Readable/WriteableStreams generic?

declare abstract class ReadableStream<R = any> {
  constructor(
    underlyingSource?: UnderlyingSource<R>,
    queuingStrategy?: StreamQueuingStrategy<R>
  );
  getReader(options: ReadableStreamGetReaderOptions): StreamBYOBReader<R>;
  getReader(): ReadableStreamDefaultReader<R>;
  pipeThrough<T>(
    transform: ReadableStreamTransform<R,T>,
    options?: PipeToOptions
  ): ReadableStream<T>;
  pipeTo(destination: WritableStream<R>, options?: PipeToOptions): Promise<void>;
  tee(): [ReadableStream<R>, ReadableStream<R>];
  values(options?: ReadableStreamValuesOptions): AsyncIterableIterator<any>;
  [Symbol.asyncIterator](
    options?: ReadableStreamValuesOptions
  ): AsyncIterableIterator<any>;
}

declare abstract class WritableStream<W = any> {
  constructor(
    underlyingSink?: UnderlyingSink<W>,
    queuingStrategy?: StreamQueuingStrategy<W>
  );
  readonly locked: boolean;
  abort(reason: any): Promise<void>;
  close(): Promise<void>;
  getWriter(): WritableStreamDefaultWriter<W>;
}

interface ReadableStreamTransform<W = any, R = any> {
  writable: WritableStream<W>;
  readable: ReadableStream<R>;
}

type ReadableStreamReader<T> = ReadableStreamDefaultReader<T>;

interface StreamQueuingStrategy<R = any> {
  size(chunk: R): number;
}

interface UnderlyingSink<W = any> {
  type?: string;
  start?(controller: WritableStreamDefaultController): any;
  write?(chunk: W, controller: WritableStreamDefaultController): any;
  abort?(reason: any): any;
  close?(): any;
}

interface UnderlyingSource<R = any> {
  type?: string;
  autoAllocateChunkSize?: number;
  start?(
    controller: ReadableStreamDefaultController<R> | ReadableByteStreamController
  ): any;
  pull?(
    controller: ReadableStreamDefaultController<R> | ReadableByteStreamController
  ): any;
  cancel?(reason?: any): any;
}

declare abstract class ReadableStreamDefaultController<R = any> {
  readonly desiredSize: number | null;
  close(): void;
  enqueue(chunk?: R): void;
  error(reason: any): void;
}

declare abstract class WritableStreamDefaultWriter<W = any> {
  constructor(stream: WritableStream);
  readonly closed: Promise<void>;
  readonly ready: Promise<void>;
  readonly desiredSize: number | null;
  abort(reason: any): Promise<void>;
  close(): Promise<void>;
  write(chunk: W): Promise<void>;
  releaseLock(): void;
}

export {};
